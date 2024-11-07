import LottoStore from '../../entities/LottoStore/LottoStore.js';

const calculateTotalPurchased = (ranks) => {
    const totalIssued = ranks.length;
    return LottoStore.LOTTO_UNIT_PRICE * totalIssued;
};

const calculateTotalPrize = (ranks) => {
    const totalPrize = ranks.reduce((acc, rank) => acc + rank.prize, 0);
    return totalPrize;
};

const calculateRevenueRate = (ranks) => {
    const totalPurchased = calculateTotalPurchased(ranks);
    const totalPrize = calculateTotalPrize(ranks);

    const revenueRate = totalPrize / totalPurchased;
    return revenueRate;
};

const DECIMAL_POINT = 2;
const roundToSecondDecimal = (number) => {
    return Number(number.toFixed(DECIMAL_POINT));
};

const ENDS_WITH_ZERO = /0$/;
const TrimZeroEnds = (number) => {
    return Number(number.toString().replace(ENDS_WITH_ZERO, ''));
};

const formatDecimal = (number) => {
    if (Number.isInteger(number)) return number;
    else {
        const rounded = roundToSecondDecimal(number);
        const trimmed = TrimZeroEnds(rounded);
        return trimmed;
    }
};

const PERCENTAGE_BASE = 100;
const toPercentage = (rate) => {
    const percentage = rate * PERCENTAGE_BASE;
    return formatDecimal(percentage);
};

export default function getRevenueRate(ranks) {
    const revenueRate = calculateRevenueRate(ranks);
    const percentage = toPercentage(revenueRate);

    return percentage;
}
