import createView from '../UI/index.js';
import issueLotto from './issueLotto.js';
import Lotto from '../domain/models/Lotto/Lotto.js';
import WinningLotto from '../domain/models/WinningLotto/WinningLotto.js';
import Rank, { getMatchingRank } from '../domain/models/Rank/Rank.js';
import countRanks from './countRanks.js';
import calculateRevenuePercentage from './calculateRevenueRate.js';
import { RetryError } from './errors.js';
import Buyer from '../domain/models/Buyer/Buyer.js';

let view = createView();
let lottoWithWinningNumbers;
let winningLotto;
let lottos = [];
let ranks = [];

const getIssueCount = (budget) => {
    const buyer = Buyer.of(budget);
    return buyer.getIssueCount();
};

const step1 = (budget) => {
    const count = getIssueCount(budget);
    view.purchasedTemplate(count);

    lottos = Array.from({ length: count }, issueLotto);
    lottos.map((lotto) => {
        view.lottoNumberTemplate(lotto.getLottoNumbers());
    });

    view.dividerTemplate();
};

const step2 = (winningNumbers) => {
    lottoWithWinningNumbers = Lotto.of(winningNumbers);
};

const step3 = (bonusNumber) => {
    winningLotto = new WinningLotto(lottoWithWinningNumbers, bonusNumber);
};

const getRanks = () => {
    Rank.initializeRanks();

    lottos.forEach((lotto) => {
        const lottoNumbers = lotto.getLottoNumbers();

        const matchCount = winningLotto.getMatchCount(lottoNumbers);
        const isBonusMatch = winningLotto.getIsBonusMatch(lottoNumbers);

        const rank = getMatchingRank(matchCount, isBonusMatch);
        ranks.push(rank);
    });
};

const getStatistics = () => {
    view.statisticsGuideTemplate();

    const rankCounter = countRanks(ranks);

    rankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        view.rankSummaryTemplate({ matchCount, isBonusMatch, prize, count });
    });

    const revenueRate = calculateRevenuePercentage(ranks);
    view.totalRevenueTemplate(revenueRate);

    view.dividerTemplate();
};

const step4 = () => {
    getRanks();
    getStatistics();
};

const runOnce = async () => {
    try {
        await view.addPurchasingPriceHandler((budget) => {
            step1(budget);
        });

        await view.addWinningNumberHandler((winningNumbers) =>
            step2(winningNumbers),
        );

        await view.addBonusNumberHandler((bonusNumber) => step3(bonusNumber));

        step4();
    } catch (error) {
        view.errorMessageTemplate(error.message);
    } finally {
        view.close();
    }
};

const runUntilFinish = async () => {
    let goToFlag = 1;

    while (goToFlag !== 5) {
        try {
            while (goToFlag === 1) {
                await view.addPurchasingPriceHandler((budget) => step1(budget));
                goToFlag = 2;
            }

            while (goToFlag === 2) {
                await view.addWinningNumberHandler((winningNumbers) =>
                    step2(winningNumbers),
                );
                goToFlag = 3;
            }

            while (goToFlag === 3) {
                await view.addBonusNumberHandler((bonusNumber) =>
                    step3(bonusNumber),
                );

                step4();
                goToFlag = 4;
            }

            while (goToFlag === 4) {
                await view.addRetryHandler((retry) => {
                    switch (retry) {
                        case 'y':
                            goToFlag = 1;
                            break;
                        case 'n':
                            goToFlag = 5;
                            break;
                        default:
                            throw new RetryError();
                    }
                });
            }
        } catch (error) {
            view.errorMessageTemplate(error.message);
        }
    }

    view.close();
};

export { runOnce, runUntilFinish };
