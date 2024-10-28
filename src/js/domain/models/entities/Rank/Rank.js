import { isNumber, isBoolean } from '../../../utils/utils.js';
import {
    IndexNotNumberError,
    PrizeNotNumberError,
    IsBonusMatchNotBooleanError,
    MatchCountNotNumberError,
    // NotInitializedIndexError,
} from './errors.js';

export default class Rank {
    #index;
    #matchCount;
    #isBonusMatch;
    #prize;

    static FIRST = new Rank(1, 6, false, 2_000_000_000);
    static SECOND = new Rank(2, 5, true, 30_000_000);
    static THIRD = new Rank(3, 5, false, 1_500_000);
    static FOURTH = new Rank(4, 4, false, 50_000);
    static FIFTH = new Rank(5, 3, false, 5_000);
    static NONE = new Rank(6, 2, false, 0);

    static from(matchCount, isBonusMatch) {
        switch (matchCount) {
            case 6:
                return Rank.FIRST;
            case 5:
                return isBonusMatch ? Rank.SECOND : Rank.THIRD;
            case 4:
                return Rank.FOURTH;
            case 3:
                return Rank.FIFTH;
            // 매칭이 3개 미만일 때 NONE 반환
            default:
                return Rank.NONE;
        }
    }

    // [ ] private constructor emulate
    constructor(index, matchCount, isBonusMatch, prize) {
        if (!isNumber(index)) throw new IndexNotNumberError();
        if (!isNumber(matchCount)) throw new MatchCountNotNumberError();
        if (!isBoolean(isBonusMatch)) throw new IsBonusMatchNotBooleanError();
        if (!isNumber(prize)) throw new PrizeNotNumberError();

        this.#index = index;
        this.#matchCount = matchCount;
        this.#isBonusMatch = isBonusMatch;
        this.#prize = prize;
    }

    get index() {
        return this.#index;
    }

    get matchCount() {
        return this.#matchCount;
    }

    get isBonusMatch() {
        return this.#isBonusMatch;
    }

    get prize() {
        return this.#prize;
    }
}
