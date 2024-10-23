import Buyer from '../domain/models/Buyer/Buyer.js';
import { isInteger } from '../domain/utils/utils.js';

const DECIMAL_POINT = 2;
const ENDS_WITH_ZERO = /0$/;
const roundToSecondDecimal = (number) => {
    return Number(number.toFixed(DECIMAL_POINT).replace(ENDS_WITH_ZERO, ''));
};

const TO_PERCENTAGE = 100;
export default function calculateRevenuePercentage(ranks) {
    const totalPurchased = Buyer.LOTTO_UNIT_PRICE * ranks.length;

    let totalPrize = ranks.reduce((acc, rank) => acc + rank.prize, 0);

    const percentage = (totalPrize / totalPurchased) * TO_PERCENTAGE;

    if (isInteger(percentage)) return percentage;
    else return roundToSecondDecimal(percentage);
}
