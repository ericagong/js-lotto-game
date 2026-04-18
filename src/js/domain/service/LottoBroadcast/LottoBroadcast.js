import Lotto from '../../entity/Lotto/Lotto.js';
import LottoNumber from '../../entity/LottoNumber/LottoNumber.js';
import WinningLotto from '../../entity/WinningLotto/WinningLotto.js';

export default class LottoBroadcast {
    static announce(numbers, bonusNumber) {
        return WinningLotto.of(Lotto.of(numbers), LottoNumber.of(bonusNumber));
    }
}
