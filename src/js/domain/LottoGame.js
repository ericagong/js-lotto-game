import DomainError from './DomainError.js';
import LottoBroadcast from './service/LottoBroadcast/LottoBroadcast.js';
import LottoMachine from './service/LottoMachine/LottoMachine.js';
import Statistics from './service/Statistics/Statistics.js';

export default class LottoGame {
    #totalCost = null;
    #lottos = null;
    #winningLotto = null;

    issueLottos(budget) {
        const { lottos, totalCost } = LottoMachine.issue(budget);
        this.#lottos = lottos;
        this.#totalCost = totalCost;

        return {
            issuedCount: this.#lottos.count,
            issuedLottosNumbers: this.#lottos.snapshot,
        };
    }

    setWinningLotto(winningNumbers, bonusNumber) {
        this.#winningLotto = LottoBroadcast.announce(winningNumbers, bonusNumber);
    }

    #determineRanks() {
        return this.#lottos.determineRanks(this.#winningLotto);
    }

    #summarize(ranks) {
        const statistics = Statistics.from(ranks, this.#totalCost);
        return {
            rankSummary: statistics.summary,
            revenueRate: statistics.revenueRate,
        };
    }

    getStatistics() {
        if (!this.#lottos || !this.#winningLotto) {
            throw new DomainError('로또 발행과 당첨 번호 설정이 먼저 완료되어야 합니다.');
        }
        const ranks = this.#determineRanks();
        return this.#summarize(ranks);
    }
}
