import {
    PurchasingPriceNotNumberError,
    PurchasingPriceIsNegativeError,
    PurchasingPriceLessLowerBoundError,
    PurchasingPriceAboveUpperBoundError,
} from './errors.js';
import {
    LOTTO_UNIT_PRICE,
    LOTTO_DIGITS,
    LOTTO_LOWER_BOUND,
    LOTTO_UPPER_BOUND,
} from '../../constants.js';
import Lotto from '../Lotto/Lotto.js';

// TODO 한 번 더 function createLottoMachine으로 wrapping하는 목적?
export default function createLottoMachine() {
    const MIN_PURCHASING_PRICE = 0;
    const MIN_ISSUE_AMOUNT = 1;
    const MAX_ISSUE_AMOUNT = 100;

    const issueLottoOf = (purchasingPrice) => {
        validatePurchasingPrice(purchasingPrice);
        const issueAmount = Math.floor(purchasingPrice / LOTTO_UNIT_PRICE);
        const lottos = [];
        for (let i = 0; i < issueAmount; i++) {
            lottos.push(issueLotto());
        }
        return lottos;
    };

    const validatePurchasingPrice = (purchasingPrice) => {
        if (typeof purchasingPrice !== 'number')
            throw new PurchasingPriceNotNumberError();
        if (purchasingPrice < MIN_PURCHASING_PRICE)
            throw new PurchasingPriceIsNegativeError();
        if (purchasingPrice < LOTTO_UNIT_PRICE * MIN_ISSUE_AMOUNT)
            throw new PurchasingPriceLessLowerBoundError();
        if (purchasingPrice > LOTTO_UNIT_PRICE * MAX_ISSUE_AMOUNT)
            throw new PurchasingPriceAboveUpperBoundError();
    };

    const generateLottoNumbers = () => {
        const lottoNumbers = new Set();
        while (lottoNumbers.size < LOTTO_DIGITS) {
            const randomNumber =
                Math.floor(Math.random() * LOTTO_UPPER_BOUND) +
                LOTTO_LOWER_BOUND;
            lottoNumbers.add(randomNumber);
        }
        return Array.from(lottoNumbers);
    };

    const issueLotto = () => {
        const lottoNumbers = generateLottoNumbers();
        return Lotto.of(lottoNumbers);
    };

    return {
        issueLottoOf,
    };
}
