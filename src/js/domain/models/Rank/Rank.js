import { isNumber, isBoolean } from '../../utils/utils.js';
import {
    IndexNotNumberError,
    PrizeNotNumberError,
    isBonusMatchNotBooleanError,
    MatchCountNotNumberError,
    NotInitializedIndexError,
} from './errors.js';

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

// Rank.initializeRanks();

export const getMatchingRank = (matchCount, isBonusMatch) => {
    if (matchCount === 6) return Rank.of(1);
    if (matchCount === 5 && isBonusMatch) return Rank.of(2);
    if (matchCount === 5) return Rank.of(3);
    if (matchCount === 4) return Rank.of(4);
    if (matchCount === 3) return Rank.of(5);
    return Rank.of(6); // 매칭이 3개 미만일 때 NONE 반환
};
