import View from '../UI/index.js';
import LottoStore from '../domain/models/entities/LottoStore/LottoStore.js';
// [ ] LottoBroadCast
import Lotto from '../domain/models/entities/Lotto/Lotto.js';
import LottoNumber from '../domain/models/entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../domain/models/entities/WinningLotto/WinningLotto.js';
import Calculator from '../domain/models/service/Calculator/index.js';
import Counter from '../domain/models/service/Counter/index.js';

import { RetryError } from './errors.js';
import ValidationError from '../domain/ValidationError.js';

let firstRankLotto;
let winningLotto;
let lottos = [];

const step1 = (budget) => {
    const lottoStore = LottoStore.of(budget);

    lottos = lottoStore.getLottos();
    const issuedCount = lottos.length;

    View.purchasedTemplate(issuedCount);
    lottos.forEach((lotto) => {
        View.lottoNumberTemplate(lotto.getNumbers());
    });

    View.dividerTemplate();
};

const step2 = (winningLottoNumbers) => {
    firstRankLotto = Lotto.of(winningLottoNumbers);
};

const step3 = (bonusNumber) => {
    const bonusLottoNumber = LottoNumber.of(bonusNumber);
    winningLotto = WinningLotto.from(firstRankLotto, bonusLottoNumber);
};

const step4 = () => {
    const ranks = lottos.map((targetLotto) =>
        winningLotto.getRank(targetLotto),
    );

    View.statisticsGuideTemplate();

    const rankCounter = Counter.countRanks(ranks);

    const revenueRate = Calculator.calculateRevenueRate(rankCounter);
    const percentage = Calculator.toPercentage(revenueRate);

    Counter.removeNoPrizeRank(rankCounter);

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

        await View.addWinningNumberHandler((winningLottoNumbers) =>
            step2(winningLottoNumbers),
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
