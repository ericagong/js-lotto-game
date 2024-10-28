import Lotto from '../entities/Lotto/Lotto.js';
import WinningLotto from '../entities/WinningLotto/WinningLotto.js';

// step2
export const getBaseWinningLotto = (winningLottoNumbers) => {
    return Lotto.of(winningLottoNumbers);
};

// step3
export const getCompletedWinningLotto = (baseWinningLotto, bonusNumber) => {
    return WinningLotto.from(baseWinningLotto, bonusNumber);
};
