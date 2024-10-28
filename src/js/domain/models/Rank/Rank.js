import { isNumber, isBoolean } from '../../utils/utils.js';
import {
    IndexNotNumberError,
    PrizeNotNumberError,
    isBonusMatchNotBooleanError,
    MatchCountNotNumberError,
    NotInitializedIndexError,
} from './errors.js';

export default class Rank {
    #index;
    #prize;
    #matchCount;
    #isBonusMatch;

    // 1-6등의 Rank 인스턴스를 static으로 정의
    static FIRST = new Rank(1, 2_000_000_000, 6, false);
    static SECOND = new Rank(2, 30_000_000, 5, true);
    static THIRD = new Rank(3, 1_500_000, 5, false);
    static FOURTH = new Rank(4, 50_000, 4, false);
    static FIFTH = new Rank(5, 5_000, 3, false);
    static NONE = new Rank(6, 0, 2, false);

    // 모든 Rank 인스턴스를 포함하는 배열
    static values = [
        Rank.FIRST,
        Rank.SECOND,
        Rank.THIRD,
        Rank.FOURTH,
        Rank.FIFTH,
        Rank.NONE,
    ];

    static of(index) {
        const rank = Rank.values.find((rank) => rank.index === index);
        if (!rank) throw new NotInitializedIndexError();
        return rank;
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
