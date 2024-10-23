import Rank from '../domain/models/Rank/Rank.js';
import Buyer from '../domain/models/Buyer/Buyer.js';
import { isInteger } from '../domain/utils/utils.js';

export const countRanks = (ranks) => {
    const rankCounter = new Map([
        [Rank.of(1), 0],
        [Rank.of(2), 0],
        [Rank.of(3), 0],
        [Rank.of(4), 0],
        [Rank.of(5), 0],
        [Rank.of(6), 0], // 낙첨
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
