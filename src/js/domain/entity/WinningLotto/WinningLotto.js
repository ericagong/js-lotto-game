import Lotto from '../Lotto/Lotto.js';
import {
    LottoNotLottoInstanceError,
    BonusNumberNotLottoNumberInstanceError,
    BonusNumberDuplicatedError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';
import Rank from '../Rank/Rank.js';

export default class WinningLotto {
    #lotto;
    #bonusNumber;

    static #validateLotto(lotto) {
        if (!(lotto instanceof Lotto)) throw new LottoNotLottoInstanceError();
    }

    static #validateBonusNumber(bonusNumber) {
        if (!(bonusNumber instanceof LottoNumber)) throw new BonusNumberNotLottoNumberInstanceError();
    }

    static #validateDuplicateBonusNumber(lotto, bonusNumber) {
        if (lotto.hasNumber(bonusNumber)) throw new BonusNumberDuplicatedError();
    }

    constructor(lotto, bonusNumber) {
        WinningLotto.#validateLotto(lotto);
        WinningLotto.#validateBonusNumber(bonusNumber);
        WinningLotto.#validateDuplicateBonusNumber(lotto, bonusNumber);

        this.#lotto = lotto;
        this.#bonusNumber = bonusNumber;
    }

    static of(lotto, bonusNumber) {
        return new WinningLotto(lotto, bonusNumber);
    }

    #hasBonusMatch(targetLotto) {
        return targetLotto.hasNumber(this.#bonusNumber);
    }

    #countMatchingNumbers(targetLotto) {
        return this.#lotto.getMatchCount(targetLotto);
    }

    getRank(targetLotto) {
        WinningLotto.#validateLotto(targetLotto);

        const matchCount = this.#countMatchingNumbers(targetLotto);
        const isBonusMatch = this.#hasBonusMatch(targetLotto);

        return Rank.from(matchCount, isBonusMatch);
    }
}
