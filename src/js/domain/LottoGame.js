import DomainError from './DomainError.js';
import LottoBroadcast from './service/LottoBroadcast/LottoBroadcast.js';
import LottoMachine from './service/LottoMachine/LottoMachine.js';
import Statistics from './service/Statistics/Statistics.js';

class LottoGameError extends DomainError {
    static #TYPE = '[LottosError]';

    constructor(message) {
        super(`${LottoGameError.#TYPE} ${message}`);
    }
}

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
            issuedLottosNumbers: this.#lottos.toNumbersList(),
        };
    }

    setWinningLotto(winningNumbers, bonusNumber) {
        if (!this.#lottos) {
            throw new LottoGameError('로또 발행이 먼저 완료되어야 합니다.');
        }
        this.#winningLotto = LottoBroadcast.announce(winningNumbers, bonusNumber);
    }

    #determineRanks() {
        return this.#lottos.determineRanks(this.#winningLotto);
    }

    #summarize(ranks) {
        const statistics = Statistics.of(ranks, this.#totalCost);
        return {
            rankSummary: statistics.summarize(),
            revenueRate: statistics.calculateRevenueRate(),
        };
    }

    getStatistics() {
        if (!this.#lottos || !this.#winningLotto) {
            throw new LottoGameError('로또 발행과 당첨 번호 설정이 먼저 완료되어야 합니다.');
        }
        const ranks = this.#determineRanks();
        return this.#summarize(ranks);
    }
}
