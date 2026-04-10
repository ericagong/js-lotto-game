# 런타임 환경에 따른 책임 분리 리팩토링

## 배경

콘솔(Node.js readline)과 웹(브라우저 DOM)은 동일한 도메인(LottoGame)을 공유하지만, 사용자 입력을 받는 방식과 흐름 모델이 본질적으로 다르다.

-   **콘솔**: sequential — 한 번에 하나의 프롬프트만 활성화, 사용자는 순서대로 입력
-   **웹**: event-driven — 모든 폼이 동시에 DOM에 존재, 사용자는 언제든 어떤 폼이든 인터랙션 가능

이 차이를 무시하고 한쪽 패턴(특히 웹에 sequential `async/await`)을 다른 쪽에 강제하면 환경 특성과 어긋나 부작용이 생긴다. 그래서 controller와 view를 환경별로 완전히 분리하고, 각 환경의 본성에 맞는 패턴을 선택했다.

---

## 1. 책임 영역에 따른 폴더 분리

### As-Is

```
js/
├── console/
└── web/   ← view, controller가 한 파일에 섞여있음
```

### To-Be

```
js/
├── console/
│   ├── runConsoleLottoGame.js   ← 진입점 (controller)
│   ├── ConsoleError.js
│   └── view/
│       ├── index.js              ← view 오케스트레이션
│       ├── ConsoleIO.js          ← I/O 프리미티브 (readline)
│       └── templates.js          ← 포맷팅 (순수 함수)
└── web/
    ├── runWebLottoGame.js        ← 진입점 (controller)
    └── view/
        ├── index.js              ← view (DOM 조작)
        └── templates.js          ← HTML 템플릿
```

[V] console/web 하위에 view/ 폴더 생성, controller와 분리

[V] 양쪽 모두 controller 파일명을 진입점 함수명과 일치시킴 (`runConsoleLottoGame.js`, `runWebLottoGame.js`)

[V] `WebError.js` 삭제 (실사용처 없음)

---

## 2. Console: sequential `async/await` 모델

콘솔은 readline이 한 번에 하나의 프롬프트만 처리하므로 sequential 모델이 자연스럽다.

### 흐름

```javascript
async function playConsoleLottoGame() {
    const game = new LottoGame();

    // 1. 구입금액 입력 (실패 시 while로 재입력)
    while (true) {
        try {
            const budgetInput = await view.askBudget();
            const result = game.issueLottos(convertStringToNumber(budgetInput));
            view.printIssuedLottos(result);
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }
    // 2. 당첨 번호 / 3. 보너스 번호 / 4. 통계 출력 (동일한 패턴)
}
```

### MVC 책임 분리

| 계층           | 책임                           | 예시                                           |
| -------------- | ------------------------------ | ---------------------------------------------- |
| **View**       | 입력 수집 + 빈값 검증          | `askBudget()` → `validateNotEmpty` → raw string |
| **Controller** | 타입 변환 + 도메인 위임 + 흐름 | `convertStringToNumber` → `game.issueLottos()`  |
| **Domain**     | 비즈니스 검증                  | 금액 범위, 번호 중복 등                        |

[V] `convertTo*` → `convertStringTo*`로 네이밍 (콘솔의 string 입력 환경 명시)

[V] `convertStringToRetryAnswer` 분리 — 입력 변환과 검증의 SRP 분리 (`convertStringToNumber`와 동일한 레벨)

[V] `playConsoleLottoGame`(한 판) / `runConsoleLottoGame`(세션) 책임 분리

[V] `runConsoleLottoGame(withRetry = false)` — step1/step2 차이를 외부 인자로 노출

[V] `do...while` 사용해 retry 흐름 명시화

[V] 에러 처리 헬퍼(`retryOnAppError`) 제거 → while문 인라인. 추상화로 인한 가독성 저하 방지

---

## 3. Web: event-driven callback 모델

웹은 폼이 항상 DOM에 살아있고 사용자가 언제든 인터랙션할 수 있으므로, sequential 모델은 환경과 맞지 않는다.

### 시도 1 — `async/await`로 IoC (실패)

콘솔과 대칭을 맞추려고 `view.askPurchasePrice()` → Promise 반환 + `await`로 controller가 흐름 주도.

**View** — 폼 submit을 Promise로 래핑:

```javascript
export default class WebView {
    #waitForSubmit($form, extractValue) {
        return new Promise((resolve) => {
            $form.addEventListener(
                'submit',
                (event) => {
                    event.preventDefault();
                    resolve(extractValue());
                },
                { once: true },
            );
        });
    }

    askPurchasePrice() {
        const $form = document.querySelector('#input-price-form');
        return this.#waitForSubmit($form, () => {
            this.#cleanupRenderedAfter($form);
            return document.querySelector('#input-price').value;
        });
    }

    askWinningLotto() {
        const $form = document.querySelector('#input-winning-lotto-nums');
        return this.#waitForSubmit($form, () => {
            const winningNumbers = Array.from(
                document.querySelectorAll('.winning-number.lotto-number'),
            ).map(($el) => $el.value);
            const bonusNumber = document.querySelector('.winning-number.bonus-number').value;
            return { winningNumbers, bonusNumber };
        });
    }
}
```

**Controller** — console과 동일한 sequential 흐름:

```javascript
export async function runWebLottoGame(view, game) {
    view.renderPurchaseForm();

    // 1. 구입금액
    while (true) {
        const priceInput = await view.askPurchasePrice();
        try {
            const result = game.issueLottos(Number(priceInput));
            view.renderIssuedLottos(result);
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }

    // 2. 당첨번호 + 보너스번호
    view.renderWinningLottoForm();
    while (true) {
        const { winningNumbers, bonusNumber } = await view.askWinningLotto();
        try {
            game.setWinningNumbers(winningNumbers.map(Number));
            game.setBonusNumber(Number(bonusNumber));
            view.renderStatistics(game.getStatistics());
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }
}
```

**드러난 문제**:

1. **첫 성공 후 폼이 "버려진 상태"가 됨** — `await`은 한 번 resolve되면 끝. 컨트롤러가 다음 단계로 넘어가면 가격 폼에 더 이상 await 코드가 없어서, 사용자가 가격 폼에 재submit해도 처리할 코드가 없음.
2. **`{ once: true }`의 딜레마** — listener를 자동 정리하면 첫 성공 후 폼이 default 동작(페이지 새로고침)으로 빠짐. 제거하면 retry마다 listener가 누적됨.
3. **워크어라운드의 복잡성** — render 메서드에 영구 `preventDefault` listener를 따로 등록하는 방식 등 여러 우회를 시도했지만, 모두 환경의 본질과 어긋난 패치였음.

→ 결론: **sequential `async/await` 모델 자체가 웹의 event-driven 본성과 어긋남.**

### 시도 2 — callback 기반 + named handler (성공)

IoC의 본질은 "controller가 sequential code를 가짐"이 아니라 **"controller가 무엇을 할지 결정하고, view는 언제 일어났는지만 알린다"**.

```javascript
export default function runWebLottoGame() {
    const view = new WebView();
    const game = new LottoGame();

    function handlePurchase(priceInput) {
        try {
            const result = game.issueLottos(Number(priceInput));
            view.renderIssuedLottos(result);
            view.renderWinningLottoForm();
            view.onWinningLottoSubmit(handleWinningLotto);
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }

    function handleWinningLotto({ winningNumbers, bonusNumber }) {
        try {
            game.setWinningNumbers(winningNumbers.map(Number));
            game.setBonusNumber(Number(bonusNumber));
            view.renderStatistics(game.getStatistics());
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }

    view.renderPurchaseForm();
    view.onPurchaseSubmit(handlePurchase);
}
```

**핵심**

-   **Controller가 흐름 정의**: `handlePurchase`/`handleWinningLotto` named 핸들러로 무엇을 할지 명시
-   **View는 이벤트 알림만**: submit 이벤트 발생 → 등록된 핸들러 호출, 다음 단계는 모름
-   **영구 listener**: 사용자가 언제든 재submit 가능, 가격 폼 재입력 시 자연스러운 재시작

[V] `askXxx()` (Promise 반환) → `onXxxSubmit(handler)` (callback 등록)으로 전환

[V] 익명 콜백 중첩 → named function으로 분리해 IoC 명확화

[V] `handleError` 추상화 제거 → `instanceof AppError` 인라인

[V] DOM 기반 `showError` 시도 후 `alert(error.message)`로 단순화

---

## 4. View 인터페이스가 다른 이유

같은 입력 수집이지만 환경에 따라 인터페이스가 달라야 한다.

| | Console (`view.askBudget`) | Web (`view.onPurchaseSubmit`) |
|---|---|---|
| **반환** | `Promise<string>` (한 번) | `void` (callback 영구 등록) |
| **호출 횟수** | 매 retry마다 새로 호출 | 시작 시 한 번 등록, 영구 동작 |
| **흐름 모델** | sequential (await) | event-driven (callback) |
| **재submit** | 다음 await에서 처리 | 같은 핸들러 자동 재실행 |

→ 같은 도메인(LottoGame)을 공유하면서, 입력/출력 레이어만 환경에 맞게 갈라진 구조.

### 왜 Console은 `askXxx` (Promise) 인터페이스인가

**Node.js readline의 본질이 sequential하기 때문**.

-   readline은 "사용자가 한 줄을 입력할 때까지 대기"하는 blocking semantics를 가진다 (실제로는 Promise로 래핑).
-   동시에 여러 프롬프트를 띄울 수 없다. 한 번에 하나의 질문만 가능.
-   사용자도 "지금 묻는 질문에 답한다"라는 단일 컨텍스트로 인지한다.

이런 환경에서 자연스러운 인터페이스는:

```javascript
const input = await view.askBudget();  // 입력 들어올 때까지 대기 → 값 반환
```

-   **컨트롤러가 능동적으로 "물어본다"**: 컨트롤러가 흐름을 직접 진행
-   **반환값이 곧 입력값**: 값이 어디서 왔는지(console, mock 등) 컨트롤러가 알 필요 없음
-   **에러는 throw로 전파**: 입력 검증 실패 시 throw → catch로 retry 흐름 자연스럽게 구성
-   **테스트 친화적**: view를 mock으로 교체해 정해진 값을 reject/resolve로 흘려보내면 그대로 시뮬레이션 가능

만약 console에 callback 방식을 쓰면 — readline 자체가 sequential인데 굳이 콜백으로 감싸는 것은 추가 추상화일 뿐 이점이 없다. retry 로직도 콜백 안에서 재호출로 처리해야 해서 오히려 복잡해진다.

### 왜 Web은 `onXxxSubmit` (callback) 인터페이스인가

**브라우저 DOM의 본질이 event-driven하기 때문**.

-   폼은 렌더링되는 순간부터 항상 살아있다. "한 번만 받고 사라지는" 입력 채널이 아님.
-   사용자는 어떤 폼이든 언제든 인터랙션할 수 있다 — 이미 제출한 폼에 다시 입력하는 것도 자연스러운 UX.
-   `submit` 이벤트는 발생할 때마다 listener를 호출하는 event emitter 패턴.

이런 환경에서 자연스러운 인터페이스는:

```javascript
view.onPurchaseSubmit(handlePurchase);  // submit 일어나면 호출해줘
```

-   **수동적 등록**: 컨트롤러는 "이 이벤트가 일어나면 이걸 해" 하고 등록만 함
-   **영구 listener**: 사용자가 같은 폼에 재submit해도 핸들러가 다시 실행됨
-   **재시도가 자동**: 입력이 잘못돼서 에러가 나면 사용자는 같은 폼에 다시 입력만 하면 됨. 컨트롤러는 별도의 retry 루프가 필요 없음
-   **DOM 모델과 일치**: `addEventListener`의 의미를 그대로 컨트롤러 레벨로 노출

만약 web에 `await` 방식을 쓰면 — `await`은 Promise를 한 번 resolve하고 끝나므로 listener가 사실상 일회용이 된다. 같은 폼에 재submit하려면 매번 새로 `await` 호출이 필요한데, 컨트롤러가 다음 단계로 넘어간 후에는 이미 await할 코드가 없어서 listener 자체가 사라지고 페이지 새로고침까지 발생한다(시도 1의 실패). 웹의 "폼은 항상 살아있다"는 본성과 정면으로 충돌한다.

### 정리: 환경의 본질에 맞춘 인터페이스

| 환경 | 본질 | 자연스러운 인터페이스 | 이유 |
|---|---|---|---|
| Console | sequential (한 번에 하나) | `await view.askXxx()` | readline이 blocking semantics |
| Web | event-driven (항상 살아있음) | `view.onXxxSubmit(handler)` | DOM 이벤트가 emitter 패턴 |

같은 패턴을 양쪽에 강제하면 한쪽은 반드시 환경과 어긋난다. **환경의 본질을 먼저 인식하고, 그 본질에 맞는 인터페이스를 선택하는 것**이 핵심.

---

## 5. 의존성 주입 방향 정리

진입점이 view/game을 생성해서 controller에 넘기던 구조를, controller가 직접 의존성을 가져오도록 변경.

### As-Is (entry point)

```javascript
// step-web-index.js
import { runWebLottoGame } from './js/web/controller.js';
import WebView from './js/web/view/index.js';
import LottoGame from './js/LottoGame.js';

runWebLottoGame(new WebView(), new LottoGame());
```

### To-Be

```javascript
// step-web-index.js
import './css/index.css';
import runWebLottoGame from './js/web/runWebLottoGame.js';

runWebLottoGame();
```

[V] view/game을 controller 내부에서 생성

[V] `export default` 통일

[V] entry point는 진입점 함수를 호출만

---

## 결론

콘솔과 웹은 도메인은 같지만 입력/출력 환경이 본질적으로 다르므로, 한쪽의 패턴을 다른 쪽에 강제하면 환경 특성과 충돌한다.

-   **Console**: sequential `async/await` — 콘솔의 readline 모델과 일치
-   **Web**: event-driven callback + named handler — 웹의 DOM 이벤트 모델과 일치
-   **공통**: IoC(controller가 흐름 결정, view는 입출력만), MVC 책임 분리, 같은 도메인 레이어(LottoGame) 공유

"환경이 다르면 패턴도 달라야 한다"는 게 핵심.
