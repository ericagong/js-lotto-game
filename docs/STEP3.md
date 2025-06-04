## 요구사항 분석 (기능 단위)

## 1. Web UI 추가

[step1] Web View 빠르게 구현

-   진입점: index.js
-   UI/web/\* 코드 작성
-   도메인 로직 변경 금지

1. 로또 구매

[V] input-price-form onSubmit 이벤트 핸들러 추가

[V] 정상 흐름 -> purchased-lottos 렌더링, input-winning-lotto-nums 렌더링

[V] 오류 발생 -> window alert

[V] lotto-numbers-toggle-button 토글 기능 추가

2. 로또 당첨 여부 확인

[V] input-lotto-nums onSubmit 이벤트 핸들러 추가

[V] 정상 흐름 -> modal 렌더링

[V] 오류 발생 -> window alert 처리

[V] 모달 open/close 기능 추가

[V] onRetry 시, 페이지 재방문

[step2] Web, Console 공통 인터페이스 추출

1. 관심사에 따라 Web index.js 코드 분리 -> InputView / OutputView

-   InputView 출력(form 렌더링) + onSubmit 이벤트 등록
-   OutputView 출력(데이터 기반 뷰 렌더링) + 웹뷰 특성상의 특수 이벤트 등록(로또 번호 토글, 모달토글)
-   웹뷰 인터페이스 interface.js로 추출

2. WebView 전용 상태머신 코드 작성

-   상태머신 코드(콘솔, 웹)에서 View 의존성 DIP -> 목적: 뷰와 비즈니스 로직의 완전 분리!!

3. InputView를 View.ask, OutputView를 View.write 형식으로 변환할지 여부 결정(View 추상화 필요 여부 결정)
   [ ] console/template -> outputView로 변경
   [ ] console/stateMachine의 converter, message reg -> inputView 부분 분리
   [ ] View 추상클래스 상속 구조 도입
   [ ] 상태머신 단일화 + next 메소드를 통해 view에 상태 전이 책임 위임

-   LottoNumber 5개 오류 해결(1, 2, 3, 4, 5,)

-   핵심은 복잡성이 감소하는가?

### 2. 배포

[ ] github pages 배포용 브랜치 생성
[ ] package.json script 추가 "build-web": "webpack --mode production --config step-web.config.js"
[ ] 배포하는 브랜치의 .gitignore에서 dist/ 삭제

[ ] 해당 브랜치에 npm run build-web 명령어 실행으로 산출된 결과물을 올려 배포

[ ] 배포 링크 readme 추가
[ ] 배포 링크 PR 추가

### 3. 최종 실행 환경 확인

[ ] 콘솔 기반 앱 실행: npm run start-step-console
[ ] 콘솔 진입점: src/step-console-index.js
[ ] 웹 기반 앱 실행: npm run start-step-web
[ ] 웹 진입점: src/step-web-index.js
