# 코딩 컨벤션

## 목차

1. [모듈화 방식](#모듈화-방식)
    - 모듈 선언 방식
    - 네이밍 규칙
2. [변수와 함수 선언 규칙](#변수와-함수-선언-규칙)
    - 변수 선언과 네이밍 규칙
    - 함수 선언 규칙
3. [내보내기와 불러오기](#내보내기와-불러오기)
4. [class 관련 구현 규칙](#class-관련-구현-규칙)
    - 선언 순서
    - 팩토리 메서드 네이밍
    - getter와 메서드 구분
    - boolean 반환 네이밍
    - 에러 클래스 네이밍

---

## 1. 모듈화 방식

### 모듈 선언 방식

-   **class 사용**: 인스턴스 별로 별도의 상태관리가 필요할 때

    ```javascript
    // Model > Car > CarModel.js
    class CarModel {
        constructor(name, position = 0) {
            this.name = name;
            this.position = position;
        }

        move() {
            this.position += 1;
        }
    }
    export default CarModel;
    ```

-   **일반 함수 사용**: 상태 관리가 필요하지 않을 때
    ```javascript
    // Model > Logger > createLogger.js
    const createLogger = (moduleName) => {
        return (message) => console.log(`[${moduleName}] ${message}`);
    };
    export default createLogger;
    ```

---

### 네이밍 규칙

-   **Class 모듈 네이밍**

    -   파일명: `Model > [ModelName] > ModelName.js`
        -   예) `Model > Car > CarModel.js`

-   **클래스 이름**: 도메인 모델을 반영

    ```javascript
    // Model > Car > CarModel.js
    class CarModel {
        /*...*/
    }
    ```

-   **에러 모듈 네이밍**

    -   파일명: `Model > [ModelName] > errors.js`
        ```javascript
        // Model > Car > errors.js
        export class CarNotFoundError extends Error {
            constructor(message) {
                super(message);
                this.name = 'CarNotFoundError';
            }
        }
        ```

-   **함수 모듈 네이밍**
    -   파일명: `Model > Car > createCar.js`
        ```javascript
        // Model > Car > createCar.js
        const createCar = (name) => new CarModel(name);
        export default createCar;
        ```

---

## 2. 변수와 함수 선언 규칙

### 변수 선언과 네이밍 규칙

-   **변수를 사용하는 함수/메소드 근처에 선언**
    ```javascript
    const calculateTotalDistance = (position, laps) => {
        const LAP_DISTANCE = 5;
        return position + laps * LAP_DISTANCE;
    };
    ```
-   **Magic Number 지양**: 의미 있는 변수명으로 대체
    ```javascript
    const MAX_POSITION = 100; // 최대 이동 거리 (O)
    const ONE_HUNDRED = 100; // 단순 숫자 100 (X)
    ```

---

### 함수 선언 규칙

-   **`const` 화살표 함수로 통일**: hoisting 없이 define-before-use를 강제하고, 재할당을 방지한다.

    ```javascript
    const accelerate = (car) => car.move();
    ```

-   **export default**: 선언 후 별도로 내보낸다.
    ```javascript
    const stopCar = (car) => {
        car.position = 0;
    };
    export default stopCar;
    ```

-   **코드 배치**: define-before-use 원칙. 의존되는 쪽을 먼저 선언하여 위에서 아래로 읽을 때 아직 모르는 이름이 등장하지 않도록 한다.

---

## 3. 내보내기와 불러오기

### 내보내기 방식

-   **export default 사용** (class와 함수 모듈)

    ```javascript
    // CarModel.js
    export default class CarModel {
        /*...*/
    }
    ```

-   **export const 사용**: 필요한 변수/함수만 내보낼 때

    ```javascript
    export const validateCarName = (name) => {
        if (!name) throw new Error('Car name is required');
    };
    ```

-   **중복 방지 네이밍**
    ```javascript
    import { validateCarName as validateName } from './CarModel.js';
    ```

---

### 불러오기 규칙

-   **가장 먼저 사용하는 모듈 순서대로 import 작성**

    ```javascript
    import CarModel from './CarModel.js';
    import { validateCarName } from './CarModel.js';

    const car = new CarModel('Lightning');
    validateCarName(car.name);
    ```

---

## 4. class 관련 구현 규칙

### 선언 순서

define-before-use 원칙에 따라, 의존되는 멤버를 먼저 선언한다.

```
fields → constants → private helpers → #validate → constructor → factory (of/from) → instance methods/getters
```

-   팩토리 메서드(`of`/`from`)는 `new`를 호출하므로 `constructor` 뒤에 배치
-   private helper는 그것을 사용하는 메서드 앞에 배치

---

### 팩토리 메서드 네이밍

-   **`of`**: 인자를 그대로 값으로 취급하여 인스턴스를 생성한다. 인자 개수와 무관.
    ```javascript
    LottoNumber.of(3);
    Lotto.of([1, 2, 3, 4, 5, 6]);
    WinningLotto.of(lotto, bonusNumber);
    ```

-   **`from`**: 다른 타입/형태로부터 변환한다.
    ```javascript
    Lottos.from(lottoArray); // Lotto[] → Lottos
    Ranks.from(rankArray);   // Rank[] → Ranks
    Rank.from(matchCount, isBonusMatch); // 판정 로직을 통한 변환
    ```

---

### getter와 메서드 구분

-   **getter**: 파라미터 없이 값을 반환할 때 (내부 계산 여부 무관)
    ```javascript
    get position() {
        return this.#position;
    }

    get totalPrize() {
        return this.#ranks.reduce((acc, rank) => acc + rank.prize, 0);
    }
    ```

-   **메서드**: 파라미터가 필요한 경우
    ```javascript
    getMatchCount(other) {
        return this.#numbers.filter((n) => otherSet.has(n)).length;
    }
    ```

---

### boolean 반환 네이밍

-   **`is`**: 상태/조건을 판별할 때
    ```javascript
    static #isValidLength(target) { return target.length === Lotto.DIGITS; }
    static #isInRange(value) { return LOWER_BOUND <= value && value <= UPPER_BOUND; }
    ```

-   **`has`**: 소유/포함 여부를 판별할 때
    ```javascript
    hasNumber(lottoNumber) { return this.#numbers.includes(lottoNumber); }
    ```

---

### 에러 클래스 네이밍

-   **클래스명**: `[Subject][Condition]Error`
    ```javascript
    NumbersNotArrayError      // numbers가 배열이 아님
    NumbersInvalidLengthError // numbers의 길이가 유효하지 않음
    BudgetBelowMinError       // budget이 최소값 미만
    ```

-   **에러 메시지**: `~여야 합니다` 패턴으로 통일 (표준 띄어쓰기)
    ```javascript
    static #MESSAGE = 'numbers는 배열 형태여야 합니다.';
    ```

---

### static 메소드와 private 필드

-   **static 메소드 사용**: `this`를 사용하지 않는 코드

    ```javascript
    class CarModel {
        static isValidName(name) {
            return typeof name === 'string' && name.length > 0;
        }
    }
    ```

-   **private 필드 사용**: 외부 접근이 필요 없는 변수

    ```javascript
    class CarModel {
        #engineStatus;

        constructor(name) {
            this.name = name;
            this.#engineStatus = 'off';
        }

        startEngine() {
            this.#engineStatus = 'on';
        }
    }
    ```
