import Rank from '../../entity/Rank/Rank.js';
import { RanksNotArrayError, RankNotRankInstanceError } from './errors.js';

export default class Ranks {
    #ranks;

    static from(ranks) {
        return new Ranks(ranks);
    }

    static #validate(ranks) {
        if (!Array.isArray(ranks)) throw new RanksNotArrayError();
        if (!ranks.every((rank) => rank instanceof Rank)) throw new RankNotRankInstanceError();
    }

    constructor(ranks) {
        Ranks.#validate(ranks);
        this.#ranks = ranks;
    }

    countByRank() {
        const counter = new Map([
            [Rank.FIRST, 0],
            [Rank.SECOND, 0],
            [Rank.THIRD, 0],
            [Rank.FOURTH, 0],
            [Rank.FIFTH, 0],
        ]);

        this.#ranks.forEach((rank) => {
            if (rank !== Rank.NONE) {
                counter.set(rank, counter.get(rank) + 1);
            }
        });

        return Array.from(counter.entries()).map(([rank, count]) => ({ rank, count }));
    }

    totalPrize() {
        return this.#ranks.reduce((acc, rank) => acc + rank.prize, 0);
    }
}
