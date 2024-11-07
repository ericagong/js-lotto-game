import View from '../UI/index.js';
import Lottos from '../domain/models/service/Lottos/index.js';
import LottoBroadCast from '../domain/models/service/LottoBroadCast/index.js';
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

// [ ] step2에서는 유효성 검사만 하면 되는게 아닐까? -> 현재구조에서는 constructor만 가져다 써야한다.
export const step2 = (winningLottoNumbers) => {
    firstRankLotto = LottoBroadCast.getFirstRankLotto(winningLottoNumbers);
};

// [ ] 실제로 lotto를 생성하는 부분을 step3로 옮기는 것이 나을 것 같다.
export const step3 = (bonusNumber) => {
    winningLotto = LottoBroadCast.getWinningLotto(firstRankLotto, bonusNumber);
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
