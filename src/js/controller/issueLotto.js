import Lotto from '../domain/models/Lotto/Lotto.js';
import LottoNumber from '../domain/models/LottoNumber/LottoNumber.js';

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * max) + min;

// [ ] LottoNumber의 책임으로 이동? static method
const generateLottoNumbers = () => {
    const lottoNumbers = new Set();
    while (lottoNumbers.size < Lotto.DIGITS) {
        lottoNumbers.add(
            generateRandomNumber(
                LottoNumber.LOWER_BOUND,
                LottoNumber.UPPER_BOUND,
            ),
        );
    }
    return Array.from(lottoNumbers);
};

export default function issueLotto() {
    const lottoNumbers = generateLottoNumbers();
    return Lotto.of(lottoNumbers);
}
