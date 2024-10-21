import { isNumber } from '../../utils/utils.js';
import {
    PurchasingPriceNotNumberError,
    PurchasingPriceIsNegativeError,
    PurchasingPriceLessLowerBoundError,
    PurchasingPriceAboveUpperBoundError,
} from './errors.js';
import Lotto from '../Lotto/Lotto.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

const MIN_PURCHASING_PRICE = 0;
const isBelowMinPurchasingPrice = (target) => target < MIN_PURCHASING_PRICE;

export const LOTTO_UNIT_PRICE = 1_000;
const MIN_ISSUE_AMOUNT = 1;
const isBelowMinIssuePrice = (target) =>
    target < LOTTO_UNIT_PRICE * MIN_ISSUE_AMOUNT;

const MAX_ISSUE_AMOUNT = 100;
const isUpperMaxIssuePrice = (target) =>
    target > LOTTO_UNIT_PRICE * MAX_ISSUE_AMOUNT;

const validate = (purchasingPrice) => {
    if (!isNumber(purchasingPrice)) throw new PurchasingPriceNotNumberError();
    if (isBelowMinPurchasingPrice(purchasingPrice))
        throw new PurchasingPriceIsNegativeError();
    if (isBelowMinIssuePrice(purchasingPrice))
        throw new PurchasingPriceLessLowerBoundError();
    if (isUpperMaxIssuePrice(purchasingPrice))
        throw new PurchasingPriceAboveUpperBoundError();
};

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * max) + min;

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

const issueLotto = () => {
    const lottoNumbers = generateLottoNumbers();
    return Lotto.of(lottoNumbers);
};

const calculateIssueAmount = (purchasingPrice) =>
    Math.floor(purchasingPrice / LOTTO_UNIT_PRICE);

export const issueLottoOf = (purchasingPrice) => {
    validate(purchasingPrice);

    const totalIssueAmount = calculateIssueAmount(purchasingPrice);

    const issuedLottos = [];

    for (let i = 0; i < totalIssueAmount; i++) {
        issuedLottos.push(issueLotto());
    }
    return issuedLottos;
};
