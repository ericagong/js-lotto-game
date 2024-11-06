import {
    IndexNotNumberError,
    PrizeNotNumberError,
    GetMatchCountError,
    GetIsBonusMatchError,
} from './errors.js';

class Rank {
    #index;
    #prize;

    static FIRST = new Rank(1, 2_000_000_000);
    static SECOND = new Rank(2, 30_000_000);
    static THIRD = new Rank(3, 1_500_000);
    static FOURTH = new Rank(4, 50_000);
    static FIFTH = new Rank(5, 5_000);
    static NONE = new Rank(6, 0);

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

    constructor(index, prize) {
        if (typeof index !== 'number') throw new IndexNotNumberError();
        if (typeof index !== 'number') throw new PrizeNotNumberError();

        this.#index = index;
        this.#prize = prize;
    }

    getMatchCount() {
        switch (this.#index) {
            case Rank.FIRST.#index:
                return 6;
            case Rank.SECOND.#index:
            case Rank.THIRD.#index:
                return 5;
            case Rank.FOURTH.#index:
                return 4;
            case Rank.FIFTH.#index:
                return 3;
            default:
                throw new GetMatchCountError();
        }
    }

    getIsBonusMatch() {
        switch (this.#index) {
            case Rank.SECOND.#index:
                return true;
            case Rank.THIRD.#index:
                return false;
            default:
                throw new GetIsBonusMatchError();
        }
    }

    get prize() {
        return this.#prize;
    }
}

const _Rank = Object.assign({}, Rank, {
    FIRST: Rank.FIRST,
    SECOND: Rank.SECOND,
    THIRD: Rank.THIRD,
    FOURTH: Rank.FOURTH,
    FIFTH: Rank.FIFTH,
    NONE: Rank.NONE,
    from: Rank.from,
});

export default _Rank;
