import WinningLotto from '../../entities/WinningLotto/WinningLotto.js';

export const setBonusNumber = (baseWinningLotto, bonusNumber) => {
    return WinningLotto.from(baseWinningLotto, bonusNumber);
};
