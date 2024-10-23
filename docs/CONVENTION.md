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
    - 변수와 메소드 선언 위치
    - 메소드 네이밍 규칙

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
    export default function createLogger(moduleName) {
        return (message) => console.log(`[${moduleName}] ${message}`);
    }
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
        export default function createCar(name) {
            return new CarModel(name);
        }
        ```

---

## 2. 변수와 함수 선언 규칙

### 변수 선언과 네이밍 규칙

-   **변수를 사용하는 함수/메소드 근처에 선언**
    ```javascript
    function calculateTotalDistance(position, laps) {
        const LAP_DISTANCE = 5; // 각 랩의 거리
        return position + laps * LAP_DISTANCE;
    }
    ```
-   **Magic Number 지양**: 의미 있는 변수명으로 대체
    ```javascript
    const MAX_POSITION = 100; // 최대 이동 거리 (O)
    const ONE_HUNDRED = 100; // 단순 숫자 100 (X)
    ```

---

### 함수 선언 규칙

-   **함수 표현식 사용**: hoisting 문제 방지

    ```javascript
    const accelerate = (car) => car.move();
    ```

-   **export default 함수 선언**
    ```javascript
    export default function stopCar(car) {
        car.position = 0;
    }
    ```

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

### 변수와 메소드 선언 위치

-   **class 외부 선언**: 독립적인 함수는 외부에 정의

    ```javascript
    const generateCarId = () => Math.random().toString(36).substring(2);

    class CarModel {
        constructor(name) {
            this.id = generateCarId();
            this.name = name;
            this.position = 0;
        }
    }
    ```

-   **utils로 분리**: 여러 파일에서 사용하는 경우
    ```javascript
    // utils/generateCarId.js
    export const generateCarId = () => Math.random().toString(36).substring(2);
    ```

---

### 메소드 네이밍 규칙

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
            this.position = 0;
            this.#engineStatus = 'off';
        }

        startEngine() {
            this.#engineStatus = 'on';
        }
    }
    ```

-   **getter 사용**: 단순히 상태를 반환할 때

    ```javascript
    class CarModel {
        constructor(name) {
            this.name = name;
            this.position = 0;
        }

        get getPosition() {
            return this.position;
        }
    }
    ```

-   **get[상태] 메소드명 사용**: 상태에 작업 수행 후 반환

    ```javascript
    class Car {
        constructor() {
            this.laps = 0;
        }

        getTotalDistance() {
            return this.laps * 5; // 각 랩의 거리 = 5
        }
    }
    ```
