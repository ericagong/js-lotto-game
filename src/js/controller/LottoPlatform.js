import createView from '../UI/index.js';
import { getIssueCount, issueLotto } from './issueLotto.js';
import {
    getBaseWinningLotto,
    getCompletedWinningLotto,
} from './setWinningLotto.js';
import Rank from '../domain/models/Rank/Rank.js';
import determineRank from './determineRank.js';
import { countRanks, calculateRevenuePercentage } from './createStatistics.js';
import { RetryError } from './errors.js';

const view = createView();
let baseWinningLotto;
let winningLotto;
let lottos = [];

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
    baseWinningLotto = getBaseWinningLotto(winningNumbers);
};

const step3 = (bonusNumber) => {
    winningLotto = getCompletedWinningLotto(baseWinningLotto, bonusNumber);
};

const step4 = () => {
    Rank.initializeRanks();

    const ranks = [];
    lottos.forEach((lotto) => {
        const lottoNumbers = lotto.getLottoNumbers();

        const matchCount = winningLotto.getMatchCount(lottoNumbers);
        const isBonusMatch = winningLotto.getIsBonusMatch(lottoNumbers);

        const rank = determineRank(matchCount, isBonusMatch);
        ranks.push(rank);
    });

    view.statisticsGuideTemplate();

    const rankCounter = countRanks(ranks);
    rankCounter.delete(Rank.of(6)); // 낙첨 제외
    rankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        view.rankSummaryTemplate({ matchCount, isBonusMatch, prize, count });
    });

    const revenueRate = calculateRevenuePercentage(ranks);
    view.totalRevenueTemplate(revenueRate);

    view.dividerTemplate();
};

// [ ] generator 도입해서 더 간결하게 리팩토링
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
