import LottoNumber from '../LottoNumber/LottoNumber.js';
import Lotto from '../Lotto/Lotto.js';
import { hasDuplicated } from '../../utils/utils.js';
import { BonusNumberDuplicatedError, NotLottoInstanceError } from './errors.js';

export default class BonusNumber extends LottoNumber {
    static from(bonusNumber, lotto) {
        return new BonusNumber(bonusNumber, lotto);
    }

    static #isInstanceOfLotto(lotto) {
        return lotto instanceof Lotto;
    }

    static #validateLotto(lotto) {
        if (!BonusNumber.#isInstanceOfLotto(lotto))
            throw new NotLottoInstanceError();
    }

    static #validateBonusNumber(bonusNumber, lotto) {
        if (hasDuplicated([bonusNumber, ...lotto.getLottoNumbers()]))
            throw new BonusNumberDuplicatedError();
    }

    constructor(bonusNumber, lotto) {
        BonusNumber.#validateLotto(lotto);
        BonusNumber.#validateBonusNumber(bonusNumber, lotto);
        super(bonusNumber);
    }
}
