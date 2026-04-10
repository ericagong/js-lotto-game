import Rank from '../Rank/Rank.js';

export default class RankStatistics {
    #ranks;
    #totalCost;

    static from(ranks, totalCost) {
        return new RankStatistics(ranks, totalCost);
    }

    constructor(ranks, totalCost) {
        this.#ranks = ranks;
        this.#totalCost = totalCost;
    }

    get summary() {
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

        return Array.from(counter.entries()).map(([rank, count]) => ({
            matchCount: rank.matchCount,
            isBonusMatch: rank.isBonusMatch,
            prize: rank.prize,
            count,
        }));
    }

    get revenueRate() {
        const totalPrize = this.#ranks.reduce((acc, rank) => acc + rank.prize, 0);
        return totalPrize / this.#totalCost;
    }
}
