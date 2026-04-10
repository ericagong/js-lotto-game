import Budget from './domain/Budget/Budget.js';
import Lotto from './domain/Lotto/Lotto.js';
import LottoNumber from './domain/LottoNumber/LottoNumber.js';
import Lottos from './domain/Lottos/Lottos.js';
import RankStatistics from './domain/RankStatistics/RankStatistics.js';
import WinningLotto from './domain/WinningLotto/WinningLotto.js';

export default class LottoGame {
    #budget = null;
    #lottos = null;
    #firstRankLotto = null;
    #winningLotto = null;

    issueLottos(budgetAmount) {
        this.#budget = Budget.of(budgetAmount);
        this.#lottos = Lottos.issue(this.#budget);

        return {
            issuedCount: this.#lottos.count,
            issuedLottosNumbers: this.#lottos.snapshot,
        };
    }

    setWinningNumbers(winningNumbers) {
        this.#firstRankLotto = Lotto.of(winningNumbers);
    }

    setBonusNumber(bonusNumber) {
        this.#winningLotto = WinningLotto.from(this.#firstRankLotto, LottoNumber.of(bonusNumber));
    }

    getStatistics() {
        const ranks = this.#lottos.determineRanks(this.#winningLotto);
        const statistics = RankStatistics.from(ranks, this.#budget.totalCost);

        return {
            rankSummary: statistics.summary,
            revenueRate: statistics.revenueRate,
        };
    }
}
