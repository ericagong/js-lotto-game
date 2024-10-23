import { isNumber, isBoolean } from '../../utils/utils.js';
import {
    IndexNotNumberError,
    PrizeNotNumberError,
    isBonusMatchNotBooleanError,
    MatchCountNotNumberError,
    NotInitializedIndexError,
} from './errors.js';

// [ ] Rank를 import해 사용하는 곳에서는 항상 Rank.initializeRanks(); 필수로 처리하게 하는 방법
// Rank 클래스 초기화 (애플리케이션 시작 시 한 번 호출)
// Rank.initializeRanks();

export default class Rank {
    #index;
    #matchCount;
    #isBonusMatch;
    #prize;

    // 1등부터 6등(낙첨)까지의 Rank 객체를 저장하는 Map
    static #ranks = new Map();

    static of(index) {
        const rank = this.#ranks.get(index);
        if (!rank) throw new NotInitializedIndexError();
        return rank;
    }

    static initializeRanks() {
        this.#ranks.set(1, new Rank(1, 2_000_000_000, false, 6));
        this.#ranks.set(2, new Rank(2, 30_000_000, true, 5));
        // 3등부터는 isBonusMatch false로 통합
        this.#ranks.set(3, new Rank(3, 1_500_000, false, 5));
        this.#ranks.set(4, new Rank(4, 50_000, false, 4));
        this.#ranks.set(5, new Rank(5, 5_000, false, 3));
        // 낙첨은 matchCount 2로 통합
        this.#ranks.set(6, new Rank(6, 0, false, 2));
    }

    constructor(index, prize, isBonusMatch, matchCount) {
        if (!isNumber(index)) throw new IndexNotNumberError();
        if (!isNumber(prize)) throw new PrizeNotNumberError();
        if (!isBoolean(isBonusMatch)) throw new isBonusMatchNotBooleanError();
        if (!isNumber(matchCount)) throw new MatchCountNotNumberError();

        this.#index = index;
        this.#prize = prize;
        this.#isBonusMatch = isBonusMatch;
        this.#matchCount = matchCount;
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

export const determineRank = (matchCount, isBonusMatch) => {
    if (matchCount === 6) return Rank.of(1);
    if (matchCount === 5 && isBonusMatch) return Rank.of(2);
    if (matchCount === 5) return Rank.of(3);
    if (matchCount === 4) return Rank.of(4);
    if (matchCount === 3) return Rank.of(5);
    return Rank.of(6); // 매칭이 3개 미만일 때 NONE 반환
};
