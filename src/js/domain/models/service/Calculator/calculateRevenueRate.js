import LottoStore from '../../entities/LottoStore/LottoStore.js';

const getTotalIssuedCount = (counter) => {
    return Array.from(counter.values()).reduce((acc, count) => acc + count, 0);
};
const calculateTotalPurchased = (counter) => {
    const totalIssued = getTotalIssuedCount(counter);
    return LottoStore.LOTTO_UNIT_PRICE * totalIssued;
};

const calculateTotalPrize = (counter) => {
    return Array.from(counter.entries()).reduce((acc, [rank, count]) => {
        return acc + rank.prize * count;
    }, 0);
};

export default function calculateRevenueRate(counter) {
    const totalPurchased = calculateTotalPurchased(counter);
    const totalPrize = calculateTotalPrize(counter);

    const revenueRate = totalPrize / totalPurchased;
    return revenueRate;
}
