import WinningLotto from '../../entities/WinningLotto/WinningLotto.js';

// step3
export const setBonusNumber = (baseWinningLotto, bonusNumber) => {
    return WinningLotto.from(baseWinningLotto, bonusNumber);
};
