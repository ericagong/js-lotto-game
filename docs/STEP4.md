## 코드 리뷰 기반 고려 사항

[ ] Lotto 입력값의 확장성 고려해 리팩토링

-   단순히 길이가 6인 배열이 아니라 ,로 구분된 문자열, 6개의 숫자 인자와 같이 다양한 방식의 입력값을 고려하려면, constructor 내부에 여러 케이스에 대해 길이가 6인 배열로 변환하는 transform 기능을 Lotto에 추가

[ ] 사용자 입력값 읽어올 때, 데이터 타입 변환 함수 리팩토링

-   Console readline 인터페이스 통해 들어오는 데이터 타입은 string이므로 string -> js 빌트인 객체로 변환하는 convert 함수 생성

-   Web 또한 string으로 읽어오므로 공통 함수 사용 가능

-   이 때, 웹의 특수성 고려해 작성하기

*   JSON 형식 여부를 검증
*   Falsy 값("", NaN, false)의 의도적 처리
*   보안상의 이유로 eval() 대신 JSON 형식으로 변환
*   null, undefined와 같은 키워드 처리

-   기존의 convertToMatchingData와 convertToArray 로직 통합

[ ] consoleReader에 stepper 구조 도입해 선언형 방식으로 리팩토링

-   consoleReader: createStepper
-   controller/runOnce, controller/runUnitlFinish: stepper에 이벤트 핸들러 주입
