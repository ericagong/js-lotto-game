import Lotto from '../../entities/Lotto/Lotto.js';

export const setWinnerLottoNumbers = (winningLottoNumbers) => {
    return Lotto.of(winningLottoNumbers);
};
