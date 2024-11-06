import LottoNumber from '../../entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../../entities/WinningLotto/WinningLotto.js';

export const setBonusNumber = (lotto, bonusNumber) => {
    const bonusLottoNumber = LottoNumber.of(bonusNumber);
    return WinningLotto.from(lotto, bonusLottoNumber);
};
