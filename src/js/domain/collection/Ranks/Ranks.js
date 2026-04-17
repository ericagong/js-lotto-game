import Rank from '../../entity/Rank/Rank.js';
import { RanksNotArrayError, RankNotRankInstanceError } from './errors.js';

export default class Ranks {
    #ranks;

    static #validate(ranks) {
        if (!Array.isArray(ranks)) throw new RanksNotArrayError();
        if (!ranks.every((rank) => rank instanceof Rank)) throw new RankNotRankInstanceError();
    }

    constructor(ranks) {
        Ranks.#validate(ranks);
        this.#ranks = ranks;
    }

    static from(ranks) {
        return new Ranks(ranks);
    }

    get countByRank() {
        const counter = new Map(Rank.PRIZE_RANKS.map((rank) => [rank, 0]));

        this.#ranks.forEach((rank) => {
            counter.set(rank, counter.get(rank) + 1);
        });

        return Array.from(counter.entries()).map(([rank, count]) => ({ rank, count }));
    }

    get totalPrize() {
        return this.#ranks.reduce((acc, rank) => acc + rank.prize, 0);
    }
}
