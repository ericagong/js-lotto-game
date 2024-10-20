import {
    PurchasingPriceNotNumberError,
    PurchasingPriceIsNegativeError,
    PurchasingPriceLessLowerBoundError,
    PurchasingPriceAboveUpperBoundError,
} from './errors.js';
import Lotto from '../Lotto/Lotto.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

export const LOTTO_UNIT_PRICE = 1_000;

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
        while (lottoNumbers.size < Lotto.DIGITS) {
            const randomNumber =
                Math.floor(Math.random() * LottoNumber.UPPER_BOUND) +
                LottoNumber.LOWER_BOUND;
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
