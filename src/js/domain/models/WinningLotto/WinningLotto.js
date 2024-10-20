// TODO 순환 참조 문제 해결
// import {
//     isInstanceOfLotto,
//     isInstanceOfBonusNumber,
// } from '../../utils/utils.js';
import BonusNumber from '../BonusNumber/BonusNumber.js';
import Lotto from '../Lotto/Lotto.js';
import {
    NotLottoInstanceError,
    NotBonusNumberInstanceError,
} from './errors.js';

import Rank, { RANKS } from '../Rank/Rank.js';

// TODO match 관련 함수 WinningLotto 외부의 당첨 확인 객체로 분리
export default class WinningLotto {
    #lotto;
    #bonusNumber;

    static from(lotto, bonusNumber) {
        return new WinningLotto(lotto, bonusNumber);
    }

    static #isInstanceOfBonusNumber(bonusNumber) {
        return bonusNumber instanceof BonusNumber;
    }

    static #isInstanceOfLotto(lotto) {
        return lotto instanceof Lotto;
    }

    static #validateLotto(lotto) {
        if (!WinningLotto.#isInstanceOfLotto(lotto))
            throw new NotLottoInstanceError();
    }

    static #validateBonusNumber(bonusNumber) {
        if (!WinningLotto.#isInstanceOfBonusNumber(bonusNumber))
            throw new NotBonusNumberInstanceError();
    }

    constructor(lotto, bonusNumber) {
        WinningLotto.#validateLotto(lotto);
        WinningLotto.#validateBonusNumber(bonusNumber);

        this.#lotto = lotto;
        this.#bonusNumber = bonusNumber;
    }

    #isBonusMatch(targetNumbers) {
        return targetNumbers.includes(this.#bonusNumber.number);
    }

    #getMatchCount(targetNumbers) {
        const winningLottoNumbers = new Set(this.#lotto.getLottoNumbers());
        const matchCount = targetNumbers.reduce(
            (count, number) =>
                winningLottoNumbers.has(number) ? count + 1 : count,
            0,
        );
        return matchCount;
    }

    #getMatchResult(targetLotto) {
        const targetLottoNumbers = targetLotto.getLottoNumbers();

        const matchCount = this.#getMatchCount(targetLottoNumbers);
        const isBonusMatch = this.#isBonusMatch(targetLottoNumbers);

        return {
            matchCount,
            isBonusMatch,
        };
    }

    // matchCount&uisBonusMatch -> rank -> prize
    #getRankFromMatchResult(matchCount, isBonusMatch) {
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
        const { matchCount, isBonusMatch } = this.#getMatchResult(targetLotto);
        const rank = this.#getRankFromMatchResult(matchCount, isBonusMatch);
        return Rank.of(rank);
    }
}
