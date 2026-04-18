import { isNumber } from '../../../utils.js';
import Lotto from '../../entity/Lotto/Lotto.js';
import Lottos from '../../collection/Lottos/Lottos.js';
import { BudgetNotNumberError, BudgetBelowMinError, BudgetAboveMaxError } from './errors.js';

export default class LottoMachine {
    static #MIN_COUNT = 1;
    static #MAX_COUNT = 100;

    static #validate(budget) {
        if (!isNumber(budget)) throw new BudgetNotNumberError();
        const min = Lotto.UNIT_PRICE * LottoMachine.#MIN_COUNT;
        const max = Lotto.UNIT_PRICE * LottoMachine.#MAX_COUNT;
        if (budget < min) throw new BudgetBelowMinError(min);
        if (budget > max) throw new BudgetAboveMaxError(max);
    }

    static issue(budget) {
        LottoMachine.#validate(budget);
        const count = Math.floor(budget / Lotto.UNIT_PRICE);
        const totalCost = count * Lotto.UNIT_PRICE;
        const lottos = Array.from({ length: count }, () => Lotto.random());
        return { lottos: Lottos.from(lottos), totalCost };
    }
}
