import Buyer from '../../entities/Buyer/Buyer.js';

const getTotalIssuedCount = (counter) => {
    return Array.from(counter.values()).reduce((acc, count) => acc + count, 0);
};
const calculateTotalPurchased = (counter) => {
    const totalIssued = getTotalIssuedCount(counter);
    return Buyer.LOTTO_UNIT_PRICE * totalIssued;
};

const calculateTotalPrize = (counter) => {
    return Array.from(counter.entries()).reduce((acc, [rank, count]) => {
        return acc + rank.prize * count;
    }, 0);
};

export const calculateRevenueRate = (counter) => {
    const totalPurchased = calculateTotalPurchased(counter); // 외부 분리 가능
    let totalPrize = calculateTotalPrize(counter);

    const revenueRate = totalPrize / totalPurchased;
    return revenueRate;
};
