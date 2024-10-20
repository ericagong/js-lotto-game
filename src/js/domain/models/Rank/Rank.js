import { isNumber } from '../../utils/utils.js';
import { RankNotNumberError, RankOutOfRangeError } from './errors.js';

export const RANKS = Object.freeze({
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    NONE: 6,
});

const PRIZES = Object.freeze({
    [RANKS.FIRST]: 2_000_000_000,
    [RANKS.SECOND]: 30_000_000,
    [RANKS.THIRD]: 1_500_000,
    [RANKS.FOURTH]: 50_000,
    [RANKS.FIFTH]: 5_000,
    [RANKS.NONE]: 0,
});

// TODO Rank는 총 5개 미리 만들어두기 (Map)
// Rank 이름 바꾸기
export default class Rank {
    #rank;
    #prize;

    static of(rank) {
        return new Rank(rank);
    }

    static #validateRank(rank) {
        if (!isNumber(rank)) throw new RankNotNumberError();
        if (rank < RANKS.FIRST || rank > RANKS.NONE)
            throw new RankOutOfRangeError();
    }

    constructor(rank) {
        Rank.#validateRank(rank);

        this.#rank = rank;
        this.#prize = PRIZES[rank];
    }

    get rank() {
        return this.#rank;
    }

    get prize() {
        return this.#prize;
    }
}
