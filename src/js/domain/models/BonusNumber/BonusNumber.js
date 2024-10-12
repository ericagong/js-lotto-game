import LottoNumber from '../LottoNumber/LottoNumber.js';
import Lotto from '../Lotto/Lotto.js';
import { BonusNumberDuplicatedError, NotLottoInstanceError } from './errors.js';

export default class BonusNumber extends LottoNumber {
    constructor(bonusNumber, lotto) {
        super(bonusNumber);
        this.#validateLotto(lotto);
        this.#validateBonusNumber(bonusNumber, lotto);
    }

    static from(bonusNumber, lotto) {
        return new BonusNumber(bonusNumber, lotto);
    }

    #isNotLottoInstance(target) {
        return !(target instanceof Lotto);
    }

    #validateLotto(lotto) {
        if (this.#isNotLottoInstance(lotto)) throw new NotLottoInstanceError();
    }

    #hasDuplicate(target, numbers) {
        return numbers.some((number) => number === target);
    }

    #validateBonusNumber(bonusNumber, lotto) {
        if (this.#hasDuplicate(bonusNumber, lotto.getLottoNumbers()))
            throw new BonusNumberDuplicatedError();
    }
}
