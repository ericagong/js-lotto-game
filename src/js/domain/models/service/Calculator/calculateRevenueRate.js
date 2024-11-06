import LottoStore from '../../entities/LottoStore/LottoStore.js';

const calculateTotalPurchased = (ranks) => {
    const totalIssued = ranks.length;
    return LottoStore.LOTTO_UNIT_PRICE * totalIssued;
};

const calculateTotalPrize = (ranks) => {
    const totalPrize = ranks.reduce((acc, rank) => acc + rank.prize, 0);
    return totalPrize;
};

export default function calculateRevenueRate(ranks) {
    const totalPurchased = calculateTotalPurchased(ranks);
    const totalPrize = calculateTotalPrize(ranks);

    const revenueRate = totalPrize / totalPurchased;
    return revenueRate;
}
