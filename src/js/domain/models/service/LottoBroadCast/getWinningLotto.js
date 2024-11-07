import LottoNumber from '../../entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../../entities/WinningLotto/WinningLotto.js';

export default function getWinningLotto(firstRankLotto, bonusNumber) {
    const bonusLottoNumber = LottoNumber.of(bonusNumber);
    const winningLotto = WinningLotto.from(firstRankLotto, bonusLottoNumber);
    return winningLotto;
}
