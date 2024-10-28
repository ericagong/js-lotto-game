import Buyer from '../../entities/Buyer/Buyer.js';

// step1
export const getIssueCount = (budget) => {
    const buyer = Buyer.of(budget);
    return buyer.getIssueCount();
};
