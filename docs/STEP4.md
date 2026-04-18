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

## 결론 — 런타임 환경에 따른 책임 분리

콘솔과 웹은 도메인은 같지만 입력/출력 환경이 본질적으로 다르므로, 한쪽의 패턴을 다른 쪽에 강제하면 환경 특성과 충돌한다.

-   **Console**: sequential `async/await` — 콘솔의 readline 모델과 일치
-   **Web**: event-driven callback + named handler — 웹의 DOM 이벤트 모델과 일치
-   **공통**: IoC(controller가 흐름 결정, view는 입출력만), MVC 책임 분리, 같은 도메인 레이어(LottoGame) 공유

"환경이 다르면 패턴도 달라야 한다"는 게 핵심.

---

# FOUC 문제 해결 — `style-loader` → `MiniCssExtractPlugin`

## 문제

페이지 첫 진입 시 제목 `🎱 행운의 로또`이 잠깐 잘못된 위치(좌측 정렬, 기본 폰트)로 보였다가 정상 스타일(가운데 정렬, 굵은 폰트)로 점프하는 현상 발생. 전형적인 **FOUC(Flash of Unstyled Content)**.

## Chrome DevTools로 원인 추적

**Network 패널 (3G throttling 적용)**

![Network overview](https://github.com/user-attachments/assets/b7d61ed2-410e-4ac1-8c16-7f29d3ed56c6)

| # | URL | Status | Size | Time |
|---|---|---|---|---|
| 1 | localhost (HTML) | 200 | 0.9 kB | 28 ms |
| 2 | reset.min.css | **302** (redirect) | 0.3 kB | 60 ms |
| 3 | **web-bundle.js** | 200 | **193 kB** | **287 ms** |
| 4 | reset.min.css (실제) | 200 | 0.8 kB | 121 ms |
| 5 | ws (HMR socket) | 101 | - | pending |

핵심 발견:

-   `reset.min.css`가 302 redirect를 받아 두 번째 요청 발생 → 추가 round-trip
-   **`web-bundle.js`가 287ms로 가장 오래 걸림** (193 KB, 3G 환경)
-   reset.css 최종본은 작아서 빠르게 도착, bundle은 한참 뒤에 도착

**`web-bundle.js`의 Timing 상세**

![Network timing](https://github.com/user-attachments/assets/518a92e4-b5e6-4dc6-a337-9de9230ce2aa)

| 단계 | 시간 |
|---|---|
| Queued at | 2.07 s |
| Started at | 2.21 s |
| Queueing | 142.00 ms |
| Stalled | 11.42 ms |
| Request sent | 0.22 ms |
| **Waiting for server response (TTFB)** | **2.06 s** |
| **Content Download** | **3.87 s** |

→ 3G throttling 환경에서 193 KB 번들 하나가 **다운로드만 ~3.87초**, 서버 응답 대기까지 합치면 **~6초** 소요. 이게 사용자가 unstyled 상태로 한참 봐야 하는 이유.

**Performance 패널 (전체 흐름)**

![Performance overview](https://github.com/user-attachments/assets/aa91e7bc-e4f6-4fcd-86b6-f83a613743c1)

LCP, INP, CLS 같은 핵심 지표가 보이고, Frames 트랙에 시간순 paint 결과가 보임.

**Performance 패널 — Frames 트랙 zoom in**

![Performance frames](https://github.com/user-attachments/assets/df0e4f3d-3182-45c5-b200-b298aca64983)

여기서 결정적인 증거가 보인다:

-   Network 트랙: `web-bundle.js (localhost)` 노란 막대가 ~92ms ~ ~242ms
-   Frames 트랙: 192ms 부근에 제목 `🎱 행운의 로또`만 단독으로 보이는 프레임
-   342ms 부근: styled 폼이 등장한 프레임
-   **Layout shifts 트랙에 342ms 부근 보라색 마커** ← 레이아웃 점프 발생 지점

→ 192ms에 제목이 unstyled로 paint된 후, 342ms에 layout shift와 함께 styled 상태로 repaint. 이게 사용자가 본 "타이틀이 한 번 떴다가 위치가 바뀌는" 현상의 정체.

## 원인 분석 — `style-loader`의 동작 방식

`step-web-index.js`에서 `import './css/index.css'`로 CSS를 가져오면, webpack은 다음 순서로 처리한다:

1. **`css-loader`**: CSS 파일을 JS 모듈로 변환. CSS 원문이 JS 문자열로 인코딩됨.

    ```javascript
    // css-loader가 만드는 모듈 (개념적)
    module.exports = '#app {\n    max-width: 400px;\n    margin: 0 auto;\n}\n...';
    ```

2. **`style-loader`**: JS 번들에 런타임 주입 코드를 추가.

    ```javascript
    // style-loader가 번들에 삽입하는 코드 (단순화)
    var styleEl = document.createElement('style');
    styleEl.appendChild(document.createTextNode(cssString));
    document.head.appendChild(styleEl);
    ```

실제 빌드된 `dist/web-bundle.js` (438KB)를 열어보면 검증할 수 있다:

-   ~244 byte 위치: CSS 원문이 JS 문자열로 인코딩 (`#app {\n    max-width: 400px;\n...`)
-   ~127065 byte 위치: `document.createElement("style")` 호출 코드 (style-loader 런타임)

즉, **CSS가 JS 번들 안에 통째로 들어있고, 브라우저에서 JS가 실행되는 순간에 비로소 `<style>` 태그가 동적으로 주입**된다.

## 브라우저 렌더링 흐름 (style-loader)

```text
1. HTML 파싱 시작
2. <head>의 <link href="reset.css"> 발견 → 다운로드 (render-blocking)
3. </body> 직전 <script defer src="web-bundle.js"> 발견 → 다운로드 시작
4. body 파싱 진행 (DOM 구성)
5. reset.css 다운로드 완료 → CSSOM 구성 → render-blocking 해제
6. ★ 브라우저가 reset.css만 적용된 상태로 First Paint  ← FOUC 발생
7. web-bundle.js 다운로드 완료 (438KB라 시간 소요) → 실행
8. style-loader 코드 실행 → document.createElement('style') → <head>에 주입
9. CSSOM 갱신 → Repaint (드디어 styled)
```

**왜 6번에서 paint가 일어나는가?**

-   `<link rel="stylesheet">`는 명시적으로 render-blocking이지만, **JS가 미래에 동적으로 주입할 `<style>`은 브라우저가 미리 알 수 없다.**
-   브라우저는 "그릴 수 있는 건 그린다" 정책. 이미 알려진 render-blocking 리소스(reset.css)가 준비되고 DOM이 구성됐으면, 그 시점에 first paint를 시작한다.
-   JS가 나중에 스타일을 주입할 거라는 사실은 브라우저 입장에서 미래의 일이라 paint를 미룰 이유가 없음.

→ **style-loader 방식은 본질적으로 FOUC를 피할 수 없다.**

## 해결 — `MiniCssExtractPlugin`으로 CSS를 별도 파일로 추출

빌드 시점에 CSS를 별도 `.css` 파일로 추출하면, `HtmlWebpackPlugin`이 자동으로 `<link rel="stylesheet">`를 `<head>`에 주입한다. 그 시점부터 브라우저는 이 CSS를 render-blocking 리소스로 인식하고 paint를 미룬다.

```javascript
// step-web.config.cjs
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // ...
    module: {
        rules: [
            // ...
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        // ...
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
    ],
};
```

`step-web-index.js`의 `import './css/index.css'`는 그대로 유지. loader만 `style-loader` → `MiniCssExtractPlugin.loader`로 교체.

## 변경 후 렌더링 흐름

```text
1. HTML 파싱 시작
2. <head>의 <link href="reset.css"> + <link href="styles.css"> 둘 다 발견
3. 두 CSS 파일 병렬 다운로드 (둘 다 render-blocking)
4. body 파싱 진행 (DOM 구성)
5. 두 CSS 모두 다운로드 완료 → CSSOM 완성
6. ★ 처음부터 styled 상태로 First Paint  ← FOUC 없음
7. JS 다운로드/실행 (UI 동작 활성화)
```

## dev 환경에서의 동작

`webpack-dev-server`는 빌드 결과물을 **디스크가 아닌 메모리**에 보관한다. dev 환경에서도 `MiniCssExtractPlugin`이 동작하는 흐름:

```text
[메모리에만 존재]
├── index.html       (HtmlWebpackPlugin이 생성)
├── web-bundle.js    (메모리)
└── styles.css       (MiniCssExtractPlugin이 생성, 메모리)
```

브라우저 요청 흐름:

1. `GET /` → dev-server가 메모리의 `index.html` 반환
2. 브라우저가 `<link rel="stylesheet" href="styles.css">` 발견 → `GET /styles.css`
3. dev-server가 메모리의 `styles.css` 반환
4. 브라우저가 `<script src="web-bundle.js">` 발견 → `GET /web-bundle.js`
5. dev-server가 메모리의 `web-bundle.js` 반환

브라우저 입장에서는 prod 환경과 완전히 동일. 단지 서버가 디스크가 아닌 메모리에서 응답할 뿐. 그래서 dev에서도 FOUC가 사라진다.

## style-loader vs MiniCssExtractPlugin 비교

| 항목 | style-loader | MiniCssExtractPlugin |
|---|---|---|
| **CSS 위치** | JS 번들 내부 (438KB 중 일부) | 별도 `.css` 파일 |
| **HTML 주입 방식** | 런타임에 JS가 `<style>` 동적 생성 | 빌드 타임에 `<link>` 자동 주입 |
| **브라우저 인지 시점** | JS 실행 후에야 알게 됨 | HTML 파싱 시점에 알게 됨 |
| **render-blocking** | ❌ (브라우저가 미리 알 수 없음) | ✅ (paint 차단 → FOUC 방지) |
| **첫 페인트** | unstyled → repaint (FOUC) | 처음부터 styled |
| **JS 번들 사이즈** | 큼 (CSS 포함) | 작음 (CSS 분리) |
| **CSS 캐싱** | JS와 함께 무효화 | 독립적 캐싱 가능 |
| **HMR** | 매우 매끄러움 (style 태그만 갱신) | 다소 무거움 (CSS 파일 재로드) |
| **설정 복잡도** | 기본 loader 1개 | 별도 플러그인 1개 추가 |

## 각 방식의 한계

**style-loader**

-   **본질적 FOUC**: JS가 실행되기 전엔 스타일을 알 수 없는 구조라 회피 불가
-   **JS 번들 비대화**: CSS 전체가 JS 안에 들어가서 번들 크기 증가
-   **캐싱 비효율**: CSS만 변경해도 JS 번들 전체가 무효화되어 재다운로드

**MiniCssExtractPlugin**

-   **HMR이 덜 매끄러움**: CSS 변경 시 style-loader처럼 즉각 반영되지 않고 좀 더 무거운 갱신
-   **추가 플러그인 의존성**: 별도 패키지 설치 필요
-   **빌드 단계 복잡도 증가**: CSS chunk가 별도로 생성됨

## MiniCssExtractPlugin을 채택한 이유

1. **FOUC가 실제로 발생하고 있고, 이 프로젝트에서 시각적으로 거슬릴 만큼 명확함** — 438KB 번들 다운로드 시간 동안 unstyled HTML이 보임. style-loader로는 본질적으로 해결 불가.

2. **HMR의 차이는 학습 단계에서 큰 영향이 아님** — CSS 변경 빈도가 낮고, 변경 시 페이지 새로고침으로 충분.

3. **번들 사이즈와 캐싱 측면에서도 이득** — CSS가 분리되면 JS 번들이 작아지고, CSS만 변경 시 JS는 캐시 유지 가능.

4. **설정 복잡도 증가는 미미** — 플러그인 하나 + loader 한 줄 교체. dev/prod 분기 없이 양쪽에 동일하게 적용 가능.

5. **프로덕션 표준 패턴을 학습할 수 있음** — 큰 앱에서는 사실상 표준이므로, 학습 프로젝트에서 미리 경험해두는 것이 가치 있음.

## 작업 체크리스트

[V] CDN reset.css를 self-host로 전환 (`src/css/reset.min.css`로 다운로드 + `index.css`에서 `@import`)

[V] `index.html`에서 CDN `<link>` 제거

[V] `mini-css-extract-plugin` 설치

[V] `step-web.config.cjs`의 css 룰을 `MiniCssExtractPlugin.loader + css-loader`로 변경

[V] `plugins`에 `new MiniCssExtractPlugin({ filename: 'styles.css' })` 추가

[V] `style-loader` 패키지 제거 (`npm uninstall style-loader`)

[V] `step-web-index.js`의 CSS import 주석 업데이트

[V] 빌드 후 dist에 `styles.css` 생성, HTML에 `<link>` 자동 주입 확인

## 적용 후 결과 검증

**Network 패널 (3G throttling 동일 환경)**

![After network](https://github.com/user-attachments/assets/695b9c12-2576-4be8-acbf-5d529bd71e70)

| 항목 | Before | After |
|---|---|---|
| `web-bundle.js` size | 193 kB | **149 kB** (-23%) |
| `reset.min.css` (CDN) | 2 requests (302 + 200) | **없음** ✓ |
| `styles.css` (로컬) | 없음 | **21.7 kB** |
| 외부 CDN 호출 | 있음 | 없음 |

→ CDN 의존이 사라지면서 redirect round-trip 제거, JS 번들도 23% 감소.

**Performance 패널 — Frames 트랙**

![After performance](https://github.com/user-attachments/assets/6d75a312-cbf0-47c8-9f31-439b36296444)

-   첫 paint부터 styled 상태로 등장 (이전엔 unstyled → styled 점프)
-   **Layout shifts 트랙에 보라색 마커 없음** — 레이아웃 점프 0
-   styles.css가 localhost 옆에 보라색 막대로 표시되어 병렬 다운로드 됨

**Insights 패널 — Local metrics**

![After metrics](https://github.com/user-attachments/assets/cbbd5f4d-6e9d-4778-b9a2-1a614ea60b6c)

| 메트릭 | 값 | 평가 |
|---|---|---|
| **CLS (Cumulative Layout Shift)** | **0** | ✅ Good — **FOUC 완전 해결** |
| LCP (Largest Contentful Paint) | 4.98 s | 🔴 Poor (단, 이건 별개 이슈 — 아래 참고) |
| LCP element | `h1.text-center` | (제목이 가장 큰 요소) |

## LCP 4.98s가 큰 문제가 아닌 이유

CLS = 0으로 **이번 작업의 목표(FOUC 제거)는 완벽하게 달성**됐다. 그런데 LCP가 4.98초로 빨갛게 표시되는 게 의아할 수 있다.

LCP가 큰 이유는 FOUC와 무관하고, **3G throttling 환경의 절대 다운로드 시간 한계** 때문이다:

```text
HTML: 2.03 s 다운로드
styles.css: 2.88 s 다운로드 (render-blocking)
└→ 첫 paint 가능 시점 = max(HTML, styles.css) ≈ 5초 부근
```

CSS가 render-blocking이므로 styles.css가 다 받기 전엔 paint 불가. 3G throttling 자체가 ~5초를 유발한다.

| 환경 | LCP 4.98s 의미 |
|---|---|
| 실제 사용자 (LTE/Wi-Fi) | 0.5~1초 수준일 것. 문제 없음 |
| 3G 사용자 (개도국, 농촌) | 진짜 느림. 추가 최적화 필요 |
| 이번 측정 (인위적 throttling) | 의도적으로 강하게 걸어서 FOUC 재현용 |

LCP를 더 줄이려면 (FOUC와 별개의 작업):

-   JS 번들 사이즈 감소 (sourcemap 외부화, polyfill 범위 축소, code splitting)
-   Critical CSS 인라인
-   HTTP 캐싱 / HTTP/2 multiplexing
-   이는 이번 챕터의 범위를 벗어나므로 후속 과제로 둔다.

## dist 파일 사이즈 비교 (production 빌드)

```bash
ls -lh dist/
```

| 파일 | Before (style-loader + CDN reset) | After (MiniCssExtract + self-host) | 변화 |
|---|---|---|---|
| **web-bundle.js** | 438 KB (CSS 포함) | **106 KB** | **-76%** |
| **styles.css** | (없음) | **141 KB** | (분리 추출) |
| **외부 CDN reset.css** | 약 0.8 KB (네트워크 호출) | (없음, self-host) | 0 round-trip |
| **합계 (전송 자산)** | 438 KB + CDN 호출 | **247 KB** (로컬) | **-44%** |

핵심:

-   JS 번들은 CSS가 빠지면서 **438 KB → 106 KB로 76% 감소**
-   CSS는 별도 파일로 분리되어 캐싱/병렬 다운로드 가능
-   CDN 의존 완전 제거 → redirect round-trip 사라짐 + 외부 네트워크 호출 0

## Chrome DevTools Insights 패널 분석

![After insights](https://github.com/user-attachments/assets/7a891adf-ff96-45fa-b403-45d0ba37b22a)

적용 후 측정에서 Insights 패널이 3개 항목을 빨갛게 표시한다. **모두 이번 작업 범위 밖이거나 의도된 트레이드오프**이므로 정리해둔다.

### 1. Use efficient cache lifetimes — Est savings of 167 KiB

| Request | Cache TTL | Size |
|---|---|---|
| /web-bundle.js | None | 145 KiB |
| /styles.css | None | 21 KiB |

-   **원인**: webpack-dev-server는 기본적으로 `Cache-Control` 헤더를 설정하지 않음
-   **의미**: 재방문 시 캐시를 못 써서 167 KiB를 다시 다운로드
-   **dev 환경 특성**이지 우리 코드 문제가 아님. 실서비스 배포(GitHub Pages, nginx, S3+CloudFront 등) 시 정적 자산에 cache 헤더가 자동으로 붙음
-   **액션**: dev에선 무시. 프로덕션 배포 환경에서 처리.

### 2. Render blocking requests — Est savings of 150 ms

| URL | Transfer Size | Duration |
|---|---|---|
| /styles.css | 21.2 KiB | 320 ms |

-   **원인**: 우리가 **의도적으로** styles.css를 render-blocking으로 만들었음 (FOUC 방지의 핵심)
-   **트레이드오프**: 150 ms 렌더 지연 ↔ FOUC 발생
    -   150 ms 줄이려면 → CSS를 defer/async → 다시 FOUC 발생
    -   유일한 절충안: Critical CSS 인라인 (핵심 CSS만 `<head>`에 직접 박고, 나머지는 defer)
-   **이번 작업의 의도와 정확히 충돌하는 항목**. CLS 0이 더 중요하므로 150ms는 받아들이는 게 합리적.

### 3. Network dependency tree — Maximum critical path latency: 187 ms

-   의존성 체인: `localhost (HTML, 127ms)` → `styles.css (187ms)`
-   **체인 길이 = 2** (이미 최소)
-   더 줄이려면 CSS를 HTML에 인라인하는 방법뿐 (Critical CSS 인라인과 같은 맥락)
-   **현재 구조에선 추가 개선 여지 없음**

### 종합

| Insight | 원인 | 우리 작업과의 관계 |
|---|---|---|
| Cache lifetimes | dev-server 특성 | 무관, 프로덕션 배포에서 해결 |
| Render blocking | **의도적 선택** | FOUC 방지를 위해 일부러 그렇게 함 |
| Critical path | HTML → CSS 체인 | 이미 최소 길이 |

→ Insights가 빨갛게 보이지만 **이번 챕터 범위에서는 정상**.

## 결론 — FOUC 문제 해결

-   **CLS 0 = 타이틀 layout shift 완전 제거 = FOUC 해결 ✓**
-   `web-bundle.js` 사이즈 76% 감소 (438 KB → 106 KB) + CDN 의존 제거
-   LCP 4.98s, render-blocking 150 ms 등은 네트워크 throttling의 한계 또는 의도된 트레이드오프
-   향후 개선 방향(범위 밖): 프로덕션 캐시 헤더, Critical CSS 인라인, JS 번들 추가 최적화
