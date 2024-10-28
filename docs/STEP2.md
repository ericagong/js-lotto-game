# 리팩토링 방향성

## 1. Rank 초기 생성 방식 간소화

### As-Is

-   어플리케이션 실행 시, Rank 초기화 함수 호출
-   Rank 초기화 함수에서는 6개의 Rank 인스턴스 생성해 map으로 관리
-   이후 Rank.of(index)로 특정 인덱스 Rank 생성 시, 기존에 생성한 인스턴스 반환

```javascript
// [ ] Rank를 import해 사용하는 곳에서는 항상 Rank.initializeRanks(); 필수로 처리하게 하는 방법
// -> flag 도입해서 Rank initialized 안되면 constructor 단에서 생성 막기?
// [ ] 어플리케이션 코드 내에서 Rank를 직접 생성하는 것을 방지하고, 반드시 getMatchingRank 함수를 통해 Rank를 생성하도록 강제
// -> export 안하기(그럼 테스트 코드 삭제)
export default class Rank {
    #index;
    #prize;
    #matchCount;
    #isBonusMatch;

    // 1등부터 6등(낙첨)까지의 Rank 객체를 저장하는 Map
    static #ranks = new Map();

    static of(index) {
        const rank = this.#ranks.get(index);
        if (!rank) throw new NotInitializedIndexError();
        return rank;
    }

    static initializeRanks() {
        this.#ranks.set(1, new Rank(1, 2_000_000_000, 6, false));
        this.#ranks.set(2, new Rank(2, 30_000_000, 5, true));
        // 3등부터는 isBonusMatch false로 통합
        this.#ranks.set(3, new Rank(3, 1_500_000, 5, false));
        this.#ranks.set(4, new Rank(4, 50_000, 4, false));
        this.#ranks.set(5, new Rank(5, 5_000, 3, false));
        // 낙첨은 matchCount 2로 통합
        this.#ranks.set(6, new Rank(6, 0, 2, false));
    }

    constructor(index, prize, matchCount, isBonusMatch) {
        if (!isNumber(index)) throw new IndexNotNumberError();
        if (!isNumber(prize)) throw new PrizeNotNumberError();
        if (!isNumber(matchCount)) throw new MatchCountNotNumberError();
        if (!isBoolean(isBonusMatch)) throw new isBonusMatchNotBooleanError();

        this.#index = index;
        this.#prize = prize;
        this.#matchCount = matchCount;
        this.#isBonusMatch = isBonusMatch;
    }

    get index() {
        return this.#index;
    }

    get prize() {
        return this.#prize;
    }

    get matchCount() {
        return this.#matchCount;
    }

    get isBonusMatch() {
        return this.#isBonusMatch;
    }
}
```

### To-Be

[X] Java enum 모방

[X] static values를 추가해 외부에서 인스턴스를 만들지 않고 바로 참조할 수 있도록 처리

[X] determineRank 함수 Rank의 static 메소드로 변경

### ADVANCED

[ ] private constructor 적용해 외부 생성 막기

-   static of 삭제
-   constructor 호출시 에러

[ ] Symbol 사용해 유일성 보장하기(디버깅 이슈)

## 2. Controller와 Model 코드 영역 분리

### As-Is

```
controller/
├── createStatistics.js
├── determineRank.js
├── errors.js
├── issueLotto.js
├── LottoPlatform.js
└── setWinningLotto.js

domain/
└── models/
    ├── Buyer/
    ├── Lotto/
    ├── LottoNumber/
    ├── Rank/
    └── WinningLotto/

```

-   controller.js에 model에만 의존하는 코드 존재해 추상화 덜 된 느낌

### To-Be

[V] Model 코드는 class 구현 여부에 따라 entries와 service로 분리

[ ] Controller에는 View와 상호작용하는 코드만 유지하고, Model과 상호작용하는 로직은 service로 이동

## 3. 기타 리팩토링 필요 부분 개선

[ ] 순환 참조 error 잡을 수 있게, eslint rule 적용

[ ] ConsoleReader InputStep 선언형 방식으로 변경

[ ] step3에서 View를 ConsoleView, HTMLView로 분화
