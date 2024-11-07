import { isNumber } from '../../../utils/utils.js';
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
        if (!isNumber(budget)) throw new BudgetNotNumberError();
        if (LottoStore.#isBelowMinBudget(budget))
            throw new BudgetBelowMinError();
        if (LottoStore.#isAboveMaxBudget(budget))
            throw new BudgetAboveMaxError();
    }

    constructor(budget) {
        LottoStore.#validate(budget);

        this.#budget = budget;
    }

    static #issueLotto() {
        const lottoNumbers = generateLottoNumbers();
        return Lotto.of(lottoNumbers);
    }

    #getMaxIssueCount() {
        return Math.floor(this.#budget / LottoStore.LOTTO_UNIT_PRICE);
    }

    getLottos() {
        const issueCount = this.#getMaxIssueCount();
        return Array.from({ length: issueCount }, () =>
            LottoStore.#issueLotto(),
        );
    }
}
