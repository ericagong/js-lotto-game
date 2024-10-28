import { isNumber } from '../../../utils/utils.js';
import {
    NotNumberError,
    BelowMinBudgetError,
    AboveMaxBudgetError,
} from './errors.js';

export default class Buyer {
    #budget;

    static of(budget) {
        return new Buyer(budget);
    }

    static #MIN_COUNT = 1;
    static #MAX_COUNT = 100;
    static LOTTO_UNIT_PRICE = 1_000;

    static #isBelowMinBudget = (target) =>
        target < Buyer.LOTTO_UNIT_PRICE * Buyer.#MIN_COUNT;
    static #isAboveMaxBudget = (target) =>
        target > Buyer.LOTTO_UNIT_PRICE * Buyer.#MAX_COUNT;

    static #validate(budget) {
        if (!isNumber(budget)) throw new NotNumberError();
        if (Buyer.#isBelowMinBudget(budget)) throw new BelowMinBudgetError();
        if (Buyer.#isAboveMaxBudget(budget)) throw new AboveMaxBudgetError();
    }

    constructor(budget) {
        Buyer.#validate(budget);

        this.#budget = budget;
    }

    // Buyer는 항상 가진 돈을 모두 써서 최대한 많은 로또를 구매
    getIssueCount() {
        return Math.floor(this.#budget / Buyer.LOTTO_UNIT_PRICE);
    }
}
