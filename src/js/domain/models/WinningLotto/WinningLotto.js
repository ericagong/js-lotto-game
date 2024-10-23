import Lotto from '../Lotto/Lotto.js';
import { hasDuplicated } from '../../utils/utils.js';
import { NotLottoInstanceError, DuplicatedError } from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

export default class WinningLotto {
    #lotto;
    #bonusNumber;

    static from(lotto, bonusNumber) {
        return new WinningLotto(lotto, bonusNumber);
    }

    static #isInstanceOfLotto(lotto) {
        return lotto instanceof Lotto;
    }

    static #validateLotto(lotto) {
        if (!WinningLotto.#isInstanceOfLotto(lotto))
            throw new NotLottoInstanceError();
    }

    static #validateBonusNumber(bonusNumber, lottoNumbers) {
        if (hasDuplicated([bonusNumber, ...lottoNumbers]))
            throw new DuplicatedError();
    }

    constructor(lotto, bonusNumber) {
        WinningLotto.#validateLotto(lotto);

        const lottoNumbers = lotto.getLottoNumbers();
        WinningLotto.#validateBonusNumber(bonusNumber, lottoNumbers);

        this.#lotto = lotto;
        this.#bonusNumber = LottoNumber.of(bonusNumber);
    }

    getIsBonusMatch(targetNumbers) {
        return targetNumbers.includes(this.#bonusNumber.number);
    }

    getMatchCount(targetNumbers) {
        const winningLottoNumbers = new Set(this.#lotto.getLottoNumbers());
        const matchCount = targetNumbers.reduce(
            (count, number) =>
                winningLottoNumbers.has(number) ? count + 1 : count,
            0,
        );
        return matchCount;
    }
}
