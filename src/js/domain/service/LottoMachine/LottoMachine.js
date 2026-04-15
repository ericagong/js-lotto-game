import Budget from '../../entity/Budget/Budget.js';
import Lotto from '../../entity/Lotto/Lotto.js';
import Lottos from '../../collection/Lottos/Lottos.js';

export default class LottoMachine {
    static issue(budgetAmount) {
        const budget = Budget.of(budgetAmount);
        const lottos = Array.from({ length: budget.maxIssueCount }, () => Lotto.random());
        return { lottos: Lottos.from(lottos), totalCost: budget.totalCost };
    }
}
