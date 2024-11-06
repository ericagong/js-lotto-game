import { isNumber, isBoolean } from '../../../utils/utils.js';
import {
    // PrivateConstructorError,
    MatchCountNotNumberError,
    IsBonusMatchNotBooleanError,
    PrizeNotNumberError,
} from './errors.js';

export default class Rank {
    #matchCount;
    #isBonusMatch;
    #prize;

    // FE에서 model 의존성을 제거하기 위해, model 추상화...
    static FIRST = new Rank(6, false, 2_000_000_000);
    static SECOND = new Rank(5, true, 30_000_000);
    static THIRD = new Rank(5, false, 1_500_000);
    static FOURTH = new Rank(4, false, 50_000);
    static FIFTH = new Rank(3, false, 5_000);
    static NONE = new Rank(2, false, 0);

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

    constructor(matchCount, isBonusMatch, prize) {
        // [ ] question - private constructor 도입 시 , constructor 내 유효성 검사 불가
        // if (new.target === Rank) throw new PrivateConstructorError();
        if (!isNumber(matchCount)) throw new MatchCountNotNumberError();
        if (!isBoolean(isBonusMatch)) throw new IsBonusMatchNotBooleanError();
        if (!isNumber(prize)) throw new PrizeNotNumberError();

        this.#matchCount = matchCount;
        this.#isBonusMatch = isBonusMatch;
        this.#prize = prize;
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
