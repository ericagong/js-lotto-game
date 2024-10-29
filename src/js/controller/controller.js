import View from '../UI/index.js';
import LottoStore from '../domain/models/service/LottoStore/index.js';
import LottoBroadcast from '../domain/models/service/LottoBroadcast/index.js';
import Statistic from '../domain/models/service/Statistic/index.js';
import { RetryError } from './errors.js';
import ValidationError from '../domain/ValidationError.js';

let baseWinningLotto;
let winningLotto;
let lottos = [];

const step1 = (budget) => {
    const count = LottoStore.getIssueCount(budget);
    View.purchasedTemplate(count);

    lottos = Array.from({ length: count }, LottoStore.issueLotto);
    lottos.forEach((lotto) => {
        View.lottoNumberTemplate(lotto.getNumbers());
    });

    View.dividerTemplate();
};

const step2 = (winningNumbers) => {
    baseWinningLotto = LottoBroadcast.setWinnerLottoNumbers(winningNumbers);
};

const step3 = (bonusNumber) => {
    winningLotto = LottoBroadcast.setBonusNumber(baseWinningLotto, bonusNumber);
};

const step4 = () => {
    const ranks = lottos.map((targetLotto) =>
        Statistic.getRank(targetLotto, winningLotto),
    );

    View.statisticsGuideTemplate();

    const rankCounter = Statistic.getCounter(ranks);

    const revenueRate = Statistic.calculateRevenueRate(rankCounter);
    const percentage = Statistic.toPercentage(revenueRate);

    Statistic.deleteNoneRank(rankCounter);

    rankCounter.forEach((count, rank) => {
        const { matchCount, isBonusMatch, prize } = rank;
        View.rankSummaryTemplate({ matchCount, isBonusMatch, prize, count });
    });

    View.totalRevenueTemplate(percentage);

    View.dividerTemplate();
};

// [ ] generator 도입해서 더 간결하게 리팩토링
const runOnce = async () => {
    try {
        await View.addPurchasingPriceHandler((budget) => {
            step1(budget);
        });

        await View.addWinningNumberHandler((winningNumbers) =>
            step2(winningNumbers),
        );

        await View.addBonusNumberHandler((bonusNumber) => step3(bonusNumber));

        step4();
    } catch (error) {
        if (error instanceof ValidationError) {
            // 예상 가능한 에러 - 에러 출력
            View.errorMessageTemplate(error.type, error.message);
        } else {
            // 예상 불가능한 에러 - 프로그램 종료
            throw error;
        }
    } finally {
        View.close();
    }
};

const runUntilFinish = async () => {
    let goToFlag = 1;

    while (goToFlag !== 5) {
        try {
            while (goToFlag === 1) {
                await View.addPurchasingPriceHandler((budget) => step1(budget));
                goToFlag = 2;
            }

            while (goToFlag === 2) {
                await View.addWinningNumberHandler((winningNumbers) =>
                    step2(winningNumbers),
                );
                goToFlag = 3;
            }

            while (goToFlag === 3) {
                await View.addBonusNumberHandler((bonusNumber) =>
                    step3(bonusNumber),
                );

                step4();
                goToFlag = 4;
            }

            while (goToFlag === 4) {
                await View.addRetryHandler((retry) => {
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
            if (error instanceof ValidationError) {
                // 예상 가능한 에러 - 에러 출력
                View.errorMessageTemplate(error.type, error.message);
            } else {
                // 예상 불가능한 에러 - 프로그램 종료
                throw error;
            }
        }
    }

    View.close();
};

export { runOnce, runUntilFinish };
