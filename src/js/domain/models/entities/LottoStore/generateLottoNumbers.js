import LottoNumber from '../LottoNumber/LottoNumber.js';
import Lotto from '../Lotto/Lotto.js';

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export default function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < Lotto.DIGITS) {
        const randomNumber = generateRandomNumber(
            LottoNumber.LOWER_BOUND,
            LottoNumber.UPPER_BOUND,
        );
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}
