import {
    BudgetNotNumberError,
    BudgetBelowMinError,
    BudgetAboveMaxError,
} from './errors.js';
import generateLottoNumbers from './generateLottoNumbers.js';
import Lotto from '../Lotto/Lotto.js';

export default class LottoStore {
    #budget;

    static of(budget) {
        return new LottoStore(budget);
    }

    static #MIN_COUNT = 1;
    static #MAX_COUNT = 100;
    static LOTTO_UNIT_PRICE = 1_000;

    static #isBelowMinBudget = (target) =>
        target < LottoStore.LOTTO_UNIT_PRICE * LottoStore.#MIN_COUNT;
    static #isAboveMaxBudget = (target) =>
        target > LottoStore.LOTTO_UNIT_PRICE * LottoStore.#MAX_COUNT;

    static #validate(budget) {
        if (typeof budget !== 'number') throw new BudgetNotNumberError();
        if (LottoStore.#isBelowMinBudget(budget))
            throw new BudgetBelowMinError();
        if (LottoStore.#isAboveMaxBudget(budget))
            throw new BudgetAboveMaxError();
    }

    constructor(budget) {
        LottoStore.#validate(budget);

        this.#budget = budget;
    }

    // default condition: LottoStore는 항상 budget을 최대한 사용해 lotto를 구매함
    getIssueCount() {
        return Math.floor(this.#budget / LottoStore.LOTTO_UNIT_PRICE);
    }

    #issueLotto() {
        const lottoNumbers = generateLottoNumbers();
        return Lotto.of(lottoNumbers);
    }

    getLottos() {
        const issueCount = this.getIssueCount();
        return Array.from({ length: issueCount }, () => this.#issueLotto());
    }
}
