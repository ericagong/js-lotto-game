import Lotto from '../Lotto/Lotto.js';
import { hasDuplicated } from '../../../utils/utils.js';
import {
    LottoNotLottoInstanceError,
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

    static #validateBonusNumber(bonusNumber, lottoNumbers) {
        if (hasDuplicated([bonusNumber, ...lottoNumbers]))
            throw new BonusNumberDuplicatedError();
    }

    constructor(lotto, bonusNumber) {
        WinningLotto.#validateLotto(lotto);

        const lottoNumbers = lotto.getNumbers();
        WinningLotto.#validateBonusNumber(bonusNumber, lottoNumbers);

        this.#lotto = lotto;
        this.#bonusNumber = LottoNumber.of(bonusNumber);
    }

    matchBonusNumber(targetNumbers) {
        return targetNumbers.includes(this.#bonusNumber.value);
    }

    getMatchCount(targetNumbers) {
        const winningLottoNumbers = new Set(this.#lotto.getNumbers());
        const matchCount = targetNumbers.reduce(
            (count, number) =>
                winningLottoNumbers.has(number) ? count + 1 : count,
            0,
        );
        return matchCount;
    }
}
