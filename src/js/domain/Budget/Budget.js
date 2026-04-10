import { isNumber } from '../../utils.js';
import { BudgetNotNumberError, BudgetBelowMinError, BudgetAboveMaxError } from './errors.js';

export default class Budget {
    #amount;

    static UNIT_PRICE = 1_000;
    static #MIN_COUNT = 1;
    static #MAX_COUNT = 100;

    static of(amount) {
        return new Budget(amount);
    }

    static #isBelowMin = (target) => target < Budget.UNIT_PRICE * Budget.#MIN_COUNT;
    static #isAboveMax = (target) => target > Budget.UNIT_PRICE * Budget.#MAX_COUNT;

    static #validate(amount) {
        if (!isNumber(amount)) throw new BudgetNotNumberError();
        if (Budget.#isBelowMin(amount)) throw new BudgetBelowMinError();
        if (Budget.#isAboveMax(amount)) throw new BudgetAboveMaxError();
    }

    constructor(amount) {
        Budget.#validate(amount);
        this.#amount = amount;
    }

    get amount() {
        return this.#amount;
    }

    get maxIssueCount() {
        return Math.floor(this.#amount / Budget.UNIT_PRICE);
    }

    get totalCost() {
        return this.maxIssueCount * Budget.UNIT_PRICE;
    }
}
