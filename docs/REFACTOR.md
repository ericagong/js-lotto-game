# 웹 UI 리팩토링 — 콜백 위젯에서 컴포넌트 패턴으로

## 의사결정 배경

-   현재 웹 UI는 "MVC"를 표방하지만 실제로는 콜백 체이닝 기반의 일회용 위젯 패턴
-   콘솔 UI는 정형화된 상태머신(STATE → 전이 레지스트리 → 핸들러 레지스트리)으로 잘 설계되어 있으나, 웹 UI는 이를 따르지 않고 즉흥적 콜백 중첩으로 구현
-   가독성과 변경 용이성을 높이기 위해, Vanilla JS 컴포넌트 패턴(상태 기반 렌더링 + 컴포넌트 트리 + props 통신)으로 전환

---

## Before: 현재 구조 분석

### 구조 요약

```
step-web-index.js
└── webStateMachine.initApp()          ← 흐름 제어 (콜백 중첩)
    ├── new PriceInputView({ onSubmit })
    │   └── onSubmit 콜백 안에서:
    │       ├── issueLottosWithBudget()   ← stateHandlers.js (모듈 let 변수)
    │       ├── new PurchasedLottosView()
    │       └── new WinningNumberInputView({ onSubmit })
    │           └── onSubmit 콜백 안에서:
    │               ├── setWinningLottoNumbers()
    │               ├── setBonusNumbers()
    │               └── new StatisticsModalView()
    └── 끝
```

### 장점

-   도메인 레이어 분리가 우수: 엔티티(LottoNumber, Lotto, WinningLotto, Rank)는 불변 값 객체 + 팩토리 메서드 + 검증 계층을 갖춘 DDD 설계. 서비스(Lottos, Ranks, LottoBroadCast)는 무상태. 이 레이어는 변경하지 않음
-   뷰가 단일 책임 컴포넌트로 분리: 4개 뷰가 각자의 화면 영역 담당
-   콘솔 View의 레지스트리 패턴이 선언적: `#messageRegistry`, `#converterRegistry`, `#outputTemplateRegistry`로 상태별 동작을 데이터로 표현

### 단점

-   콜백 중첩이 흐름을 들여쓰기 깊이로 표현: 순차적 흐름(구매 → 표시 → 입력 → 통계)이 콜백 안의 콜백으로 인코딩됨. 단계 추가 시 중첩 레벨이 깊어짐
-   모듈 레벨 `let` 변수가 보이지 않는 공유 상태: `stateHandlers.js`의 `let firstRankLotto; let winningLotto; let lottos = []`는 호출 순서가 강제되지 않는 암묵적 상태머신. 테스트, 초기화, 검사 불가능
-   뷰가 4가지 책임을 동시에 수행: HTML 생성, DOM 삽입, 이벤트 바인딩, 입력 변환, 에러 처리를 생성자 한 곳에서 처리
-   콘솔과 웹의 아키텍처 불일치: 콘솔은 정형화된 상태머신, 웹은 즉흥적 콜백 체이닝

### 한계

-   뷰 재렌더링 불가능: 생성자에서 한 번 렌더링하고 끝. `update()` 메서드 없음
-   `insertAdjacentHTML('beforeend')` 패턴이 누적 버그 유발: 리렌더링 시 기존 내용을 지우지 않고 뒤에 계속 추가. 같은 뷰를 두 번 생성하면 DOM에 중복 요소가 쌓임
-   상태 초기화 수단이 `window.location.reload()`뿐: 모듈 레벨 상태를 코드로 초기화할 방법이 없어 브라우저 새로고침에 의존
-   뷰가 전역 DOM ID에 강결합: `document.querySelector('#main-container')` 하드코딩으로 컨테이너 변경, 재사용, 테스트 불가능

---

## After: Vanilla JS 컴포넌트 패턴

### 구조 요약

```
step-web-index.js
└── new App(document.querySelector('#app'))
    ├── state: { lottos, issuedLottosNumbers, rankSummary, revenueRate, isModalOpen }
    ├── template(): 자식 마운트 포인트 배치
    ├── mounted(): state 조건에 따라 자식 컴포넌트 생성 + props 전달
    │   ├── new PriceInput($el, { onSubmit: this.handlePurchase })
    │   ├── new PurchasedLottos($el, { issuedCount, issuedLottosNumbers })  ← 조건부
    │   ├── new WinningNumberInput($el, { onSubmit: this.handleWinningNumbers })  ← 조건부
    │   └── new StatisticsModal($el, { rankSummary, revenueRate, onReset })  ← 조건부
    ├── handlePurchase(): 도메인 서비스 호출 → setState()
    ├── handleWinningNumbers(): 도메인 서비스 호출 → setState()
    └── handleReset(): setup() + render()
```

### 장점

-   상태 기반 렌더링: `setState()` 호출 시 자동 리렌더링. DOM은 항상 현재 state를 반영
-   흐름이 조건부 렌더링으로 표현: 콜백 중첩 대신 `mounted()`에서 `if (state.xxx)` 조건으로 단계 제어. 단계 추가는 조건 하나 + 컴포넌트 하나
-   상태가 `App.state`에 응집: 모듈 레벨 `let` 변수 제거. 검사, 초기화(`setup()` + `render()`), 테스트 가능
-   컴포넌트 생명주기가 명확: `setup() → setEvent() → render() → mounted()` 순서로 예측 가능
-   이벤트 위임으로 리렌더링 안전: `addEvent()`가 `$target`에 한 번만 등록하므로, `render()`로 내부 DOM이 교체되어도 이벤트 유지
-   `window.location.reload()` 제거: `handleReset()`이 state 초기화 + 리렌더링으로 대체
-   전역 DOM ID 결합 제거: 컴포넌트가 `$target`(주입받은 컨테이너) 기준으로 상대 탐색

### 한계 (인지하고 수용)

-   `innerHTML` 교체 방식이라 리렌더링 시 포커스/입력 상태 유실: 이 앱에서는 `setState()`가 폼 제출 시점에만 호출되므로 실질적 문제 없음
-   자식 컴포넌트가 부모 리렌더링 시 매번 재생성: PurchasedLottos의 토글 상태 등이 초기화됨. 모달 표시 시점에는 이미 사용자가 이전 단계를 완료한 상태이므로 수용 가능

### 대안 검토 (채택하지 않은 이유)

| 대안                                | 불채택 이유                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **EventBus + AppState + Presenter** | 파일 6~7개 신규 생성. 30줄짜리 EventBus, 이벤트 상수, Presenter 3개 등 구조적 복잡도가 앱 규모 대비 과도함.    |
| **기존 콘솔 상태머신을 웹에 적용**  | 웹의 비동기 이벤트 구동 특성(사용자가 언제 폼을 제출할지 모름)과 콘솔의 동기 루프 패턴이 근본적으로 맞지 않음. |
| **React/Vue 등 프레임워크 도입**    | 교육 목적 프로젝트에서 프레임워크 의존성은 학습 목표에 반함.                                                   |

---

## 변경 단계

### Phase 1: Component 베이스 클래스 생성

-   새 파일: `src/js/core/Component.js`
-   `setup()`, `template()`, `render()`, `mounted()`, `setEvent()`, `setState()`, `addEvent()` 생명주기 메서드 제공

### Phase 2: App 컴포넌트 작성

-   새 파일: `src/js/UI/web/App.js`
-   state 관리: `{ lottos, issuedLottosNumbers, rankSummary, revenueRate, isModalOpen }`
-   도메인 서비스 직접 호출 (`Lottos.issue()`, `LottoBroadCast`, `Ranks`)
-   `mounted()`에서 state 조건에 따라 자식 컴포넌트 마운팅
-   `handlePurchase()`, `handleWinningNumbers()`, `handleReset()` 메서드

### Phase 3: 기존 뷰를 컴포넌트로 변환

| 파일                                                  | 변환 내용                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `PriceInputView.js` → `PriceInput.js`                 | `template()` + `setEvent()` 분리. `this.props.onSubmit` 사용. |
| `PurchasedLottosView.js` → `PurchasedLottos.js`       | `this.props`에서 데이터 수신. 토글은 `setEvent()`.            |
| `WinningNumberInputView.js` → `WinningNumberInput.js` | `template()` + `setEvent()` 분리. `this.props.onSubmit` 사용. |
| `StatisticsModalView.js` → `StatisticsModal.js`       | `this.props`에서 데이터 수신. 리셋은 `this.props.onReset()`.  |

### Phase 4: 진입점 수정 & 정리

-   `step-web-index.js`: `initApp()` → `new App(document.querySelector('#app'))`
-   `webStateMachine.js`: 삭제 (App이 대체)
-   콘솔 관련 코드: 변경 없음
