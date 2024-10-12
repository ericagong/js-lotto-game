import Lotto from '../Lotto/Lotto.js';
import BonusNumber from '../BonusNumber/BonusNumber.js';
import {
    NotLottoInstanceError,
    NotBonusNumberInstanceError,
} from './errors.js';
import { RANKS } from '../../constants.js';
import Rank from '../Rank/Rank.js';

export default class WinningLotto {
    #lotto;
    #bonusNumber;

    static from(lotto, bonusNumber) {
        return new WinningLotto(lotto, bonusNumber);
    }

    constructor(lotto, bonusNumber) {
        this.#validateLotto(lotto);
        this.#lotto = lotto;

        this.#validateBonusNumber(bonusNumber);
        this.#bonusNumber = bonusNumber;
    }

    #isNotLottoInstance(target) {
        return !(target instanceof Lotto);
    }

    #isNotBonusNumberInstance(target) {
        return !(target instanceof BonusNumber);
    }

    #validateLotto(lotto) {
        if (this.#isNotLottoInstance(lotto)) throw new NotLottoInstanceError();
    }

    #validateBonusNumber(bonusNumber) {
        if (this.#isNotBonusNumberInstance(bonusNumber))
            throw new NotBonusNumberInstanceError();
    }

    #getRankFromMatchInfo(matchCount, isBonusMatch) {
        switch (matchCount) {
            case 6:
                return RANKS.FIRST;
            case 5:
                if (isBonusMatch) return RANKS.SECOND;
                return RANKS.SECOND;
            case 4:
                return RANKS.FOURTH;
            case 3:
                return RANKS.FIFTH;
            default:
                return RANKS.NONE;
        }
    }

    getRank(targetLotto) {
        const winningLottoNumbers = this.#lotto.getLottoNumbers();
        const targetLottoNumbers = targetLotto.getLottoNumbers();

        const matchCount = winningLottoNumbers.filter((number) =>
            targetLottoNumbers.includes(number),
        ).length;
        const isBonusMatch = targetLottoNumbers.includes(this.#bonusNumber);

        const rank = this.#getRankFromMatchInfo(matchCount, isBonusMatch);
        return Rank.of(rank);
    }
}
