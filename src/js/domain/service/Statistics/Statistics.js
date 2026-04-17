import { isNumber } from '../../../utils.js';
import Ranks from '../../collection/Ranks/Ranks.js';
import { RanksNotRanksInstanceError, TotalCostNotPositiveNumberError } from './errors.js';

export default class Statistics {
    #ranks;
    #totalCost;

    static #validate(ranks, totalCost) {
        if (!(ranks instanceof Ranks)) throw new RanksNotRanksInstanceError();
        if (!isNumber(totalCost) || totalCost <= 0) throw new TotalCostNotPositiveNumberError();
    }

    constructor(ranks, totalCost) {
        Statistics.#validate(ranks, totalCost);
        this.#ranks = ranks;
        this.#totalCost = totalCost;
    }

    static from(ranks, totalCost) {
        return new Statistics(ranks, totalCost);
    }

    get summary() {
        return this.#ranks.countByRank;
    }

    get revenueRate() {
        return this.#ranks.totalPrize / this.#totalCost;
    }
}
