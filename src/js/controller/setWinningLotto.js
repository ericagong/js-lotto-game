import Lotto from '../domain/models/Lotto/Lotto.js';
import WinningLotto from '../domain/models/WinningLotto/WinningLotto.js';

// step2
export const getBaseWinningLotto = (winningLottoNumbers) => {
    return Lotto.of(winningLottoNumbers);
};

// step3
export const getCompletedWinningLotto = (baseWinningLotto, bonusNumber) => {
    return WinningLotto.from(baseWinningLotto, bonusNumber);
};
