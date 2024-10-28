import Lotto from '../../entities/Lotto/Lotto.js';

// step2
export const setWinnerLottoNumbers = (winningLottoNumbers) => {
    return Lotto.of(winningLottoNumbers);
};
