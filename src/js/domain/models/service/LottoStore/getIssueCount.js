import Buyer from '../../entities/Buyer/Buyer.js';

export const getIssueCount = (budget) => {
    const buyer = Buyer.of(budget);
    return buyer.getIssueCount();
};
