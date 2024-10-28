import Buyer from '../../entities/Buyer/Buyer.js';
import { isInteger } from '../../../utils/utils.js';

const DECIMAL_POINT = 2;
const ENDS_WITH_ZERO = /0$/;
const roundToSecondAndTrimZeroEnds = (number) => {
    return Number(number.toFixed(DECIMAL_POINT).replace(ENDS_WITH_ZERO, ''));
};

// [ ] counter 기반 계산 방식으로 변경
const calculateTotalPurchased = (count) => Buyer.LOTTO_UNIT_PRICE * count;
const calculateTotalPrize = (ranks) =>
    ranks.reduce((acc, rank) => acc + rank.prize, 0);

const PERCENTAGE_BASE = 100;
const toPercentage = (revenueRate) => {
    const value = revenueRate * PERCENTAGE_BASE;
    if (isInteger(value)) return value;
    else return roundToSecondAndTrimZeroEnds(value);
};

export const getRevenuePercentage = (ranks) => {
    const totalPurchased = calculateTotalPurchased(ranks.length); // 외부 분리 가능

    let totalPrize = calculateTotalPrize(ranks);

    const revenueRate = totalPrize / totalPurchased;

    return toPercentage(revenueRate);
};
