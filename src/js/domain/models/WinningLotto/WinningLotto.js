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

    #getMatchCount(winningNumbers, targetNumbers) {
        return winningNumbers.filter((number) => targetNumbers.includes(number))
            .length;
    }

    // TODO 메소드를 클래스 내부에 포함하는 기준을 무엇으로 해야하는지?
    // util 함수, class 외부, static, non-static 인스턴스 메소드(prototype), private 메소드,
    #isBonusMatch(bonusNumber, targetNumbers) {
        return targetNumbers.includes(bonusNumber);
    }

    #getMatchResult(targetLotto) {
        const winningLottoNumbers = this.#lotto.getLottoNumbers();
        const targetLottoNumbers = targetLotto.getLottoNumbers();

        const matchCount = this.#getMatchCount(
            winningLottoNumbers,
            targetLottoNumbers,
        );

        const bonusNumber = this.#bonusNumber.getNumber();
        const isBonusMatch = this.#isBonusMatch(
            bonusNumber,
            targetLottoNumbers,
        );

        return {
            matchCount,
            isBonusMatch,
        };
    }

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
