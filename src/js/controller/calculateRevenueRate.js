import { LOTTO_UNIT_PRICE } from '../domain/models/LottoMachine/issueLottoOf.js';
import { isInteger } from '../domain/utils/utils.js';

const DECIMAL_POINT = 2;
const ENDS_WITH_ZERO = /0$/;
const roundToSecondDecimal = (number) => {
    return Number(number.toFixed(DECIMAL_POINT).replace(ENDS_WITH_ZERO, ''));
};

export default function calculateRevenuePercentage(ranks) {
    const totalPurchased = LOTTO_UNIT_PRICE * ranks.length;

    let totalPrize = ranks.reduce((acc, rank) => acc + rank.prize, 0);

    const percentage = (totalPrize / totalPurchased) * 100;

    if (isInteger(percentage)) return percentage;
    else return roundToSecondDecimal(percentage);
}
