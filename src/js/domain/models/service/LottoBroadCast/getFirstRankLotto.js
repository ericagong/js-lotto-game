import Lotto from '../../entities/Lotto/Lotto.js';

export default function getFirstRankLotto(winningLottoNumbers) {
    const firstRankLotto = Lotto.of(winningLottoNumbers);
    return firstRankLotto;
}
