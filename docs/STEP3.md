## 요구사항 분석 (기능 단위)

## 1. Web UI 추가

[step1] Web View 빠르게 구현

-   진입점: index.js
-   UI/web/\* 코드 작성
-   도메인 로직 변경 금지

1. 로또 구매

-   input-price-form onSubmit 이벤트 핸들러 추가
-   정상 흐름 -> purchased-lottos 렌더링, input-winning-lotto-nums 렌더링
-   오류 발생 -> window alert
-   lotto-numbers-toggle-button 토글 기능 추가

2. 로또 당첨 여부 확인

-   input-lotto-nums onSubmit 이벤트 핸들러 추가
-   정상 흐름 -> modal 렌더링
-   오류 발생 -> window alert 처리
-   모달 open/close 기능 추가
-   onRetry 시, 페이지 재방문?

[step2] Web, Console 공통 인터페이스 추출
[ ] 리팩토링 전 데모 링크 먼저 보고 방향성 검토하기

[ ] Controller 코드를 console/web 구현체에 관계없이 사용할 수 있도록, View -> HTMLView / ConsoleView 상속 방식 도입

```javascript
class View {}
class HTMLView extends View {}
class ConsoleView extends View {}
```

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
