import Lotto from '../Lotto/Lotto.js';
import {
    LottoNotLottoInstanceError,
    BonusNumberNotLottoNumberInstanceError,
    BonusNumberDuplicatedError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

export default class WinningLotto {
    #lotto;
    #bonusNumber;

    static from(lotto, bonusNumber) {
        return new WinningLotto(lotto, bonusNumber);
    }

    static #validateLotto(lotto) {
        if (!(lotto instanceof Lotto)) throw new LottoNotLottoInstanceError();
    }

    static #validateBonusNumber(bonusNumber) {
        if (!(bonusNumber instanceof LottoNumber))
            throw new BonusNumberNotLottoNumberInstanceError();
    }

    static #validateDuplicateBonusNumber(lotto, bonusNumber) {
        if (lotto.contains(bonusNumber)) throw new BonusNumberDuplicatedError();
    }

    constructor(lotto, bonusNumber) {
        WinningLotto.#validateLotto(lotto);
        WinningLotto.#validateBonusNumber(bonusNumber);
        WinningLotto.#validateDuplicateBonusNumber(lotto, bonusNumber);

        this.#lotto = lotto;
        this.#bonusNumber = bonusNumber;
    }

    matchBonusNumber(targetLotto) {
        WinningLotto.#validateLotto(targetLotto);

        return targetLotto.contains(this.#bonusNumber);
    }

    getMatchCount(targetLotto) {
        WinningLotto.#validateLotto(targetLotto);

        const winningLottoNumbers = new Set(this.#lotto.getNumbers());
        const targetLottoNumbers = targetLotto.getNumbers();
        const matchCount = targetLottoNumbers.reduce(
            (count, number) =>
                winningLottoNumbers.has(number) ? count + 1 : count,
            0,
        );
        return matchCount;
    }
}
