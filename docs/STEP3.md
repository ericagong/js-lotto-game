## 요구사항 분석 (기능 단위)

## 1. Web UI 추가

[step1] Web UI만 View/ 에 추가

-   도메인 로직 변경 금지
-   index.js에 코드 작성
-   runUntilFinish 처럼 사용자가 no 라고 하기 전까지 동작하는 방식으로 구현

1. 로또 구매

-   input-price-form
    -   구입 금액 읽어오기
        [ ] 최초에는 onSubmit 전까지 반응 X
        [ ] onSubmit Handler - 오류 시, 구입 금액 관련 오류 input alert - 정상 시, 로또 발행하며 purchased-lottos , input-lotto-nums form display
        [ ] onSubmit 이후에는 실시간 유효성 체크
-   purchased-lottos
    -   display 시,
        [ ] 총 n개를 구매하였습니다. 가이드 display
        [ ] default = toggle off
        [ ] 이미지만
        [ ] 가로 정렬
    -   onToggle: on
        [ ] 세로 정렬
        [ ] 이미지 + 번호

2. 로또 당첨 여부 확인

-   input-lotto-nums

    -   로또 당첨 번호 읽어오기
        [ ] 최초에는 onSubmit 전까지 반응 X
        [ ] onSumbit Handler - 오류 시,
        [ ] LottoNumber 관련 오류: 각 input alert
        [ ] Lotto, BonusNumber 중복 관련 오류: window alert - 성공 시, 당첨 통계 결과 모달 display
        [ ] onSubmit 이후에는 실시간 유효성 체크

-   당첨 통계 모달
    [ ] modal close 기능 추가
    [ ] 당첨 통계 display
    [ ] 수익률 display
    [ ] onRetry 다시하기 버튼 - 다시 시작하기 클릭 시, 구입 금액 입력 초기화 상태로 복귀

[step2] Web, Console 공통 인터페이스 추출
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
