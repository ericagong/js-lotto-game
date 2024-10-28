import Rank from '../entities/Rank/Rank.js';
import Buyer from '../entities/Buyer/Buyer.js';
import { isInteger } from '../../utils/utils.js';

export const countRanks = (ranks) => {
    const rankCounter = new Map([
        [Rank.FIRST, 0],
        [Rank.SECOND, 0],
        [Rank.THIRD, 0],
        [Rank.FOURTH, 0],
        [Rank.FIFTH, 0],
        [Rank.NONE, 0], // 낙첨
    ]);

    ranks.forEach((rank) => {
        rankCounter.set(rank, rankCounter.get(rank) + 1 || 0);
    });

    return rankCounter;
};

const DECIMAL_POINT = 2;
const ENDS_WITH_ZERO = /0$/;
const roundToSecondDecimal = (number) => {
    return Number(number.toFixed(DECIMAL_POINT).replace(ENDS_WITH_ZERO, ''));
};

const TO_PERCENTAGE = 100;
export const calculateRevenuePercentage = (ranks) => {
    const totalPurchased = Buyer.LOTTO_UNIT_PRICE * ranks.length;

    let totalPrize = ranks.reduce((acc, rank) => acc + rank.prize, 0);

    const percentage = (totalPrize / totalPurchased) * TO_PERCENTAGE;

    if (isInteger(percentage)) return percentage;
    else return roundToSecondDecimal(percentage);
};
