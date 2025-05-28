import Lottos from '../domain/models/service/Lottos/index.js';
import LottoBroadCast from '../domain/models/service/LottoBroadCast/index.js';
import Ranks from '../domain/models/service/Ranks/index.js';

let firstRankLotto;
let winningLotto;
let lottos = [];

export const issueLottosWithBudget = (budget) => {
    lottos = Lottos.issue(budget);

    const issuedCount = lottos.length;
    const issuedLottosNumbers = lottos.map((lotto) => lotto.getNumbers());

    return { issuedCount, issuedLottosNumbers };
};

export const setWinningLottoNumbers = (winningLottoNumbers) => {
    firstRankLotto = LottoBroadCast.getFirstRankLotto(winningLottoNumbers);
};

export const setBonusNumbers = (bonusNumber) => {
    winningLotto = LottoBroadCast.getWinningLotto(firstRankLotto, bonusNumber);
};

export const getStatistics = () => {
    const ranks = Lottos.determineRanks(lottos, winningLotto);

    const winningRankCounter = Ranks.getRankStatistic(ranks);

    const rankSummary = [];
    winningRankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        rankSummary.push({ matchCount, isBonusMatch, prize, count });
    });

    const revenueRate = Ranks.getRevenueRate(ranks);

    return { rankSummary, revenueRate };
};
