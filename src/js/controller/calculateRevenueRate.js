import { LOTTO_UNIT_PRICE } from '../domain/models/LottoMachine/issueLottoOf.js';

const DECIMAL_POINT = 2;
const endsWithZero = /.\d+0/;
const roundToSecondDecimalPoint = (number) => {
    if (Number.isInteger(number)) return number.toString();

    const formatted = number.toFixed(DECIMAL_POINT);

    return endsWithZero.test(formatted) ? formatted.slice(0, -1) : formatted;
};

export default function calculateRevenueRate(ranks) {
    const totalPurchased = LOTTO_UNIT_PRICE * ranks.length;

    let totalRevenue = ranks.reduce((acc, rank) => acc + rank.prize, 0);

    const revenueRate = (totalRevenue / totalPurchased) * 100;

    return roundToSecondDecimalPoint(revenueRate);
}
