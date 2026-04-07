# 요구 사항 분석 with RDD

## 0. 상태 정의: 시스템 책임 파악 -> 한 문장 정의

-   로또 구입 금액과 당첨 번호, 보너스 번호를 사용자로부터 입력받아 로또를 발행하고, 로또 당첨 여부를 판단하여, 당첨 내역과 수익률을 출력한다

-   이 때, (1) UI 영역(입/출력)과 도메인 영역을 분리해 단순화

    -   UI
        -   사용자로부터 콘솔 입력
        -   콘솔 출력
    -   도메인
        -   로또 구입 금액, 당첨 번호, 보너스 번호로 로또를 발행하고,
        -   로또 당첨 여부를 판단하여,
        -   당첨 내역과 수익률을 반환한다.

-   이 때, (2) 가장 작은 단위의 핵심 기능 버전부터 구현 -> 복잡성을 추가하며 버전 확장
    -   가장 작은 단위의 핵심 기능:
        -   Ver1. 로또 한 장을 발행하고, 당첨 등수와 수익률을 반환
    -   확장:
        -   Ver2. 로또 여러 장을 발행하고, 당첨 등수 내역과 누적 수익률을 반환
        -   Ver3. UI 영역 붙이기

## 1. 기능 분리: 시스템 책임을 작은 책임들로 분할

-   feature1. 로또 한 장 발행
-   feature2. 로또 당첨 여부 확인
-   feature3. 당첨 등수, 금액 반환
-   feature4. 수익률 계산

## 2. 객체 협력 컨텍스트 설계: 변경과 확장이 용이하도록

### 2-1. 각 책임에 대해 ROC 분석 -> 도메인 멘탈 모델로 협력 흐름 그리기

### 2-2. 객체 협력 관계도 추출

### 2-3. 목적에 따른 객체 구현 방식 선택

## 3. 세부 기능 구현 순서 지정: 구현 용이성, 최종 상태 근접 여부 기준

-   도메인 영역 먼저 구현 후, UI 영역 코드 붙이기
    -   입/출력 로직 제외하고 선구현
-   f1 -> f2 -> f3 -> f4

## 4. 세부 기능 단위 구현 with TDD

### 4-1. 세부 기능 구체화: 구현 사항 및 edge case 리스트화

#### feature1. 로또 한 장 발행

-   구현 사항

    [V] 1-45 사이 임의의 숫자 생성

    [V] 중복 처리

    [V] 6개의 숫자 배열 반환

-   예외 케이스

#### feature2. 로또 당첨 여부 확인

-   구현 사항

    [V] 당첨 번호와 비교해 일치 개수 세기

    [V] 일치 개수 5개인 경우만, 보너스 번호 일치 여부 확인

    [V] 당첨 시에만 feature3 실행

-   예외 케이스

    [V] 당첨 번호 중복

    [V] 당첨 번호와 보너스 번호 중복

    [V] 당첨 번호 1-45 밖

    [V] 보너스 버호 1-45 밖

#### feature3. 당첨 등수, 금액 반환

-   구현 사항

    [V] 일치 개수 기반 등수 반환

    [V] 등수 기반 금액 반환

-   예외 케이스

    [V] 없는 등수

#### feature4. 수익률 계산

-   구현 사항

    [V] 미당첨 시, 0 반환

    [V] 당첨 시, 당첨 금액/투자금 % 반환

    [V] % 소수점 처리

-   예외 케이스

    [V] 당첨 금액이 0인 경우

    [V] 투자금이 0인 경우

### 4-2. TDD cycle 따라 구현과 리팩토링을 오가며 개발

-   구현: 실패하는 테스트 코드 작성 -> 프로덕션 코드 작성
-   리팩토링: 가독성, 재사용성, 성능 고려

## V1 -> V2 기능 확장

[feature1] 로또 발행 한 장 -> 여러 장

-   PurchasingPrice로 구매가능한 최대한의 로또 개수만큼 로또를 발행한다.
-   로또를 하나도 못 사는 금액을 입력하면, 에러를 발생시킨다.

[feature2] 당첨 여부 판단 한 장 -> 여러 장

-   여러 장의 로또에 대해 당첨 여부를 판단해 ranks에 저장한다.

[feature3] 여러 장에 대해 당첨 등수 통계와 총 수익률을 반환한다.

-   여러 장에 대한 당첨 등수 통계를 반환한다.
-   총 수익률을 반환한다.

---

## Step2: 변경된 요구 사항 반영

### [feature1] 로또 발행

[V] 로또 번호 오름차순 정렬

### [feature5] UI - 재시작/종료 여부 사용자 입력 받기

-   사용자로부터 재시작/종료 여부 입력 받기

[V] y, n 아닌 경우, 에러 메시지 출력 후 재입력 처리

### 에러 발생 및 처리

-   사용자가 잘못된 값을 입력한 경우 throw 문으로 에러 발생시키고, 에러 메시지 출력 후 해당 부분부터 입력 다시 받기

    [V] purchasingPrice를 잘못 입력한 경우

    [V] winningLottoNumbers를 잘못 입력한 경우

    [V] BonusNumber를 잘못 입력한 경우

    [V] 그 외 Error 발생한 경우, 앱 종료

### Step2 리팩토링

[V] class가 불필요한 경우 모듈로 변경

[V] 불필요한 코드 삭제

[V] 의도 드러내는 메소드명 확인(클라이언트 입장)

### Step2 리팩토링 방향성

#### 1. Rank 초기 생성 방식 간소화

-   As-Is

    -   어플리케이션 실행 시, Rank 초기화 함수 호출
    -   Rank 초기화 함수에서는 6개의 Rank 인스턴스 생성해 map으로 관리
    -   이후 Rank.of(index)로 특정 인덱스 Rank 생성 시, 기존에 생성한 인스턴스 반환

-   To-Be

    [V] Java enum 모방

    [V] static values를 추가해 외부에서 인스턴스를 만들지 않고 바로 참조할 수 있도록 처리

    [V] fromRank 함수 Rank의 static 메소드로 변경

-   ADVANCED

    [ ] private constructor 적용해 외부 생성 막기

    [ ] Symbol 사용해 유일성 보장하기(디버깅 이슈)

    [ ] values 추가

#### 2. Controller와 Model 코드 영역 분리

-   As-Is

    -   controller.js에 model에만 의존하는 코드 존재해 추상화 덜 된 느낌

-   To-Be

    [V] Model 코드는 class 구현 여부에 따라 entries와 service로 분리

    [V] Controller에는 View와 상호작용하는 코드만 유지하고, Model과 상호작용하는 로직은 service로 이동

    [V] service 하위 코드 역할에 따라, 도메인 멘탈 모델 이름 하에 모듈화

-   ADVANCED

    [V] 도메인 멘탈 모델 기반 객체 역할/책임에 따라 네이밍 변경

    [V] 관심사 집약적 코드로 변경: service 내 로직 중 entities와 연관 깊은 코드는 entities의 class static 메소드로 위치 이동

    [V] service/\*에 index.js 통합 내보내기 방식 도입

#### 3. 기타 리팩토링 필요 부분 개선

[V] 순환 참조 error 잡을 수 있게, eslint rule 적용

[V] utils의 수레바퀴 재발명 지양

[V] ValidationError 메소드 추가

[V] 어플리케이션단 Error catch 구조 변경

[ ] ranks enum 모방

[V] LottoNumber 45개 만들어두고 시작하는 방식으로 변경

[ ] ConsoleReader InputStep 선언형 방식으로 변경

[ ] step3에서 View를 ConsoleView, HTMLView로 분화 -> View 추상클래스 상속 구조 도입

[ ] Counter 중심으로 서비스 로직 변경

---

## Step3: 요구사항 분석 (기능 단위)

### 1. Web UI 추가

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

    [V] console/template -> outputView로 변경

    [V] console/stateMachine의 converter, message reg -> inputView 부분 분리

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

[V] 콘솔 기반 앱 실행: npm run start-step-console

[V] 콘솔 진입점: src/step-console-index.js

[V] 웹 기반 앱 실행: npm run start-step-web

[V] 웹 진입점: src/step-web-index.js

---

## Step4: 코드 리뷰 기반 고려 사항

[ ] Lotto 입력값의 확장성 고려해 리팩토링

-   단순히 길이가 6인 배열이 아니라 ,로 구분된 문자열, 6개의 숫자 인자와 같이 다양한 방식의 입력값을 고려하려면, constructor 내부에 여러 케이스에 대해 길이가 6인 배열로 변환하는 transform 기능을 Lotto에 추가

[ ] 사용자 입력값 읽어올 때, 데이터 타입 변환 함수 리팩토링

-   Console readline 인터페이스 통해 들어오는 데이터 타입은 string이므로 string -> js 빌트인 객체로 변환하는 convert 함수 생성

-   Web 또한 string으로 읽어오므로 공통 함수 사용 가능

-   이 때, 웹의 특수성 고려해 작성하기

    -   JSON 형식 여부를 검증
    -   Falsy 값("", NaN, false)의 의도적 처리
    -   보안상의 이유로 eval() 대신 JSON 형식으로 변환
    -   null, undefined와 같은 키워드 처리

-   기존의 convertToMatchingData와 convertToArray 로직 통합

[ ] consoleReader에 stepper 구조 도입해 선언형 방식으로 리팩토링

-   consoleReader: createStepper
-   controller/runOnce, controller/runUnitlFinish: stepper에 이벤트 핸들러 주입
