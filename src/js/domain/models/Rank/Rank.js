import { RankNotNumberError, RankOutOfRangeError } from './errors.js';

export const RANKS = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    NONE: 6,
};

export default class Rank {
    // TODO 변수 선언 위치 : utils, 클래스 외부, 내부 static, non-static, private
    PRIZES = {
        [RANKS.FIRST]: 2_000_000_000,
        [RANKS.SECOND]: 30_000_000,
        [RANKS.THIRD]: 1_500_000,
        [RANKS.FOURTH]: 50_000,
        [RANKS.FIFTH]: 5_000,
        [RANKS.NONE]: 0,
    };
    RANK_LOWER_BOUND = RANKS.FIRST;
    RANK_UPPER_BOUND = RANKS.NONE;
    #rank;
    #prize;

    static of(rank) {
        return new Rank(rank);
    }

    constructor(rank) {
        this.#validateRank(rank);

        this.#rank = rank;
        this.#prize = this.PRIZES[rank];
    }

    #validateRank(rank) {
        if (typeof rank !== 'number') throw new RankNotNumberError();
        if (rank < this.RANK_LOWER_BOUND || rank > this.RANK_UPPER_BOUND)
            throw new RankOutOfRangeError();
    }

    getRank() {
        return this.#rank;
    }

    getPrize() {
        return this.#prize;
    }
}
