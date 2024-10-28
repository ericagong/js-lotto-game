import Lotto from '../../entities/Lotto/Lotto.js';
import LottoNumber from '../../entities/LottoNumber/LottoNumber.js';

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateLottoNumbers = () => {
    const numbers = new Set();
    while (numbers.size < Lotto.DIGITS) {
        const randomNumber = generateRandomNumber(
            LottoNumber.LOWER_BOUND,
            LottoNumber.UPPER_BOUND,
        );
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
};

export const issueLotto = () => {
    const lottoNumbers = generateLottoNumbers();
    return Lotto.of(lottoNumbers);
};
