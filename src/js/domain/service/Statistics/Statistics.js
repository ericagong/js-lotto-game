import { isNumber } from '../../../utils.js';
import Ranks from '../../collection/Ranks/Ranks.js';
import { RanksNotRanksInstanceError, TotalCostNotPositiveNumberError } from './errors.js';

export default class Statistics {
    #ranks;
    #totalCost;

    static #validate(ranks, totalCost) {
        if (!Ranks.isRanks(ranks)) throw new RanksNotRanksInstanceError();
        if (!isNumber(totalCost) || totalCost <= 0) throw new TotalCostNotPositiveNumberError();
    }

    constructor(ranks, totalCost) {
        Statistics.#validate(ranks, totalCost);
        this.#ranks = ranks;
        this.#totalCost = totalCost;
    }

    static of(ranks, totalCost) {
        return new Statistics(ranks, totalCost);
    }

    summarize() {
        return this.#ranks.countByRank();
    }

    calculateRevenueRate() {
        return this.#ranks.calculateTotalPrize() / this.#totalCost;
    }
}
