import { RANKS, LOTTO_UNIT_PRICE } from '../constants.js';

export default class Statistics {
    DECIMAL_POINT = 2;

    count(ranks) {
        const rankCounts = new Map([
            [RANKS.FIRST, 0],
            [RANKS.SECOND, 0],
            [RANKS.THIRD, 0],
            [RANKS.FOURTH, 0],
            [RANKS.FIFTH, 0],
            [RANKS.NONE, 0],
        ]);

        ranks.forEach((rank) => {
            const key = rank.getRank();
            rankCounts.set(key, rankCounts.get(key) + 1);
        });

        return Array.from(rankCounts.values());
    }

    calculate(ranks) {
        let totalRevenue = 0;

        const totalPurchased = LOTTO_UNIT_PRICE * ranks.length;

        ranks.forEach((rank) => {
            totalRevenue += rank.getPrize();
        });

        const revenueRate = (totalRevenue / totalPurchased) * 100;
        return this.#roundToSecondDecimalPoint(revenueRate);
    }

    #roundToSecondDecimalPoint(number) {
        if (Number.isInteger(number)) return number.toString();

        const formatted = number.toFixed(this.DECIMAL_POINT);
        const endRegExp = /.\d+0/;
        return endRegExp.test(formatted) ? formatted.slice(0, -1) : formatted;
    }
}
