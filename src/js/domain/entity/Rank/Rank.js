import { isNumber } from '../../../utils.js';
import { PrizeNotNumberError } from './errors.js';

export default class Rank {
    #prize;

    static FIRST = new Rank(2_000_000_000);
    static SECOND = new Rank(30_000_000);
    static THIRD = new Rank(1_500_000);
    static FOURTH = new Rank(50_000);
    static FIFTH = new Rank(5_000);
    static NONE = new Rank(0);

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
            default:
                return Rank.NONE;
        }
    }

    constructor(prize) {
        if (!isNumber(prize)) throw new PrizeNotNumberError();
        this.#prize = prize;
    }

    get prize() {
        return this.#prize;
    }
}
