import View from '../UI/index.js';
import Lottos from '../domain/models/service/Lottos/index.js';
import Lotto from '../domain/models/entities/Lotto/Lotto.js';
import LottoNumber from '../domain/models/entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../domain/models/entities/WinningLotto/WinningLotto.js';
import Calculator from '../domain/models/service/Calculator/index.js';
import Counter from '../domain/models/service/Counter/index.js';

let firstRankLotto;
let winningLotto;
let lottos = [];

export const step1 = (budget) => {
    lottos = Lottos.issue(budget);
    const issuedCount = lottos.length;

    View.purchasedTemplate(issuedCount);
    lottos.forEach((lotto) => {
        View.lottoNumberTemplate(lotto.getNumbers());
    });

    View.dividerTemplate();
};

export const step2 = (winningLottoNumbers) => {
    firstRankLotto = Lotto.of(winningLottoNumbers);
};

export const step3 = (bonusNumber) => {
    const bonusLottoNumber = LottoNumber.of(bonusNumber);
    winningLotto = WinningLotto.from(firstRankLotto, bonusLottoNumber);
};

export const step4 = () => {
    const ranks = Lottos.determineRanks(lottos, winningLotto);

    View.statisticsGuideTemplate();

    const rankCounter = Counter.countRanks(ranks);

    const revenueRate = Calculator.calculateRevenueRate(ranks);
    const percentage = Calculator.toPercentage(revenueRate);

    Counter.removeNoPrizeRank(rankCounter);

    rankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        View.rankSummaryTemplate({ matchCount, isBonusMatch, prize, count });
    });

    View.totalRevenueTemplate(percentage);

    View.dividerTemplate();
};
