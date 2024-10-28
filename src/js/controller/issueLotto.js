import Buyer from '../domain/models/entities/Buyer/Buyer.js';
import Lotto from '../domain/models/entities/Lotto/Lotto.js';
import LottoNumber from '../domain/models/entities/LottoNumber/LottoNumber.js';

// step1
export const getIssueCount = (budget) => {
    const buyer = Buyer.of(budget);
    return buyer.getIssueCount();
};

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

export const issueLotto = () => {
    const lottoNumbers = generateLottoNumbers();
    return Lotto.of(lottoNumbers);
};
