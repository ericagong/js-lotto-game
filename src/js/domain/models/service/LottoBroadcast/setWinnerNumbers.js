import Lotto from '../../entities/Lotto/Lotto.js';

export const setWinnerLottoNumbers = (lottoNumbers) => {
    return Lotto.of(lottoNumbers);
};
