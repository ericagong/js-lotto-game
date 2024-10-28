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
    #prize;
    #matchCount;
    #isBonusMatch;

    static FIRST = new Rank(1, 2_000_000_000, 6, false);
    static SECOND = new Rank(2, 30_000_000, 5, true);
    static THIRD = new Rank(3, 1_500_000, 5, false);
    static FOURTH = new Rank(4, 50_000, 4, false);
    static FIFTH = new Rank(5, 5_000, 3, false);
    static NONE = new Rank(6, 0, 2, false);

    static determine(matchCount, isBonusMatch) {
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
    constructor(index, prize, matchCount, isBonusMatch) {
        if (!isNumber(index)) throw new IndexNotNumberError();
        if (!isNumber(prize)) throw new PrizeNotNumberError();
        if (!isNumber(matchCount)) throw new MatchCountNotNumberError();
        if (!isBoolean(isBonusMatch)) throw new IsBonusMatchNotBooleanError();

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
