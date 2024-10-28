import createView from '../UI/index.js';
import { getIssueCount } from '../domain/models/service/LottoStrore/getIssueCount.js';
import { issueLotto } from '../domain/models/service/LottoStrore/issueLotto.js';
import { setWinnerLottoNumbers } from '../domain/models/service/LottoBroadcast/setWinnerNumbers.js';
import { setBonusNumber } from '../domain/models/service/LottoBroadcast/setBonusNumber.js';
import Rank from '../domain/models/entities/Rank/Rank.js';
import { getRankCounter } from '../domain/models/service/Statistic/getRankCounter.js';
import { getRevenuePercentage } from '../domain/models/service/Statistic/getRevenuePercentage.js';
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
    baseWinningLotto = setWinnerLottoNumbers(winningNumbers);
};

const step3 = (bonusNumber) => {
    winningLotto = setBonusNumber(baseWinningLotto, bonusNumber);
};

const step4 = () => {
    const ranks = [];
    lottos.forEach((lotto) => {
        const lottoNumbers = lotto.getLottoNumbers();

        const matchCount = winningLotto.getMatchCount(lottoNumbers);
        const isBonusMatch = winningLotto.getIsBonusMatch(lottoNumbers);

        const rank = Rank.determine(matchCount, isBonusMatch);
        ranks.push(rank);
    });

    view.statisticsGuideTemplate();

    const rankCounter = getRankCounter(ranks);
    rankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        view.rankSummaryTemplate({ matchCount, isBonusMatch, prize, count });
    });

    const revenueRate = getRevenuePercentage(ranks);

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
