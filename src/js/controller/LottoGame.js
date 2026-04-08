import Lottos from '../domain/models/service/Lottos/index.js';
import LottoBroadCast from '../domain/models/service/LottoBroadCast/index.js';
import Ranks from '../domain/models/service/Ranks/index.js';

export default class LottoGame {
    #lottos = [];
    #firstRankLotto = null;
    #winningLotto = null;

    issueLottos(budget) {
        this.#lottos = Lottos.issue(budget);

        const issuedCount = this.#lottos.length;
        const issuedLottosNumbers = this.#lottos.map((lotto) => lotto.getNumbers());

        return { issuedCount, issuedLottosNumbers };
    }

    setWinningNumbers(winningNumbers) {
        this.#firstRankLotto = LottoBroadCast.getFirstRankLotto(winningNumbers);
    }

    setBonusNumber(bonusNumber) {
        this.#winningLotto = LottoBroadCast.getWinningLotto(this.#firstRankLotto, bonusNumber);
    }

    getStatistics() {
        const ranks = Lottos.determineRanks(this.#lottos, this.#winningLotto);

        const winningRankCounter = Ranks.getRankStatistic(ranks);

        const rankSummary = [];
        winningRankCounter.forEach((count, rank) => {
            const { matchCount, isBonusMatch, prize } = rank;
            rankSummary.push({ matchCount, isBonusMatch, prize, count });
        });

        const revenueRate = Ranks.getRevenueRate(ranks);

        return { rankSummary, revenueRate };
    }
}
