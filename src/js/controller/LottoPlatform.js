import issueLottoOf from '../domain/models/LottoMachine/issueLottoOf.js';
import Lotto from '../domain/models/Lotto/Lotto.js';
import WinningLotto from '../domain/models/WinningLotto/WinningLotto.js';
import Rank, { getMatchingRank } from '../domain/models/Rank/Rank.js';
import countRanks from './countRanks.js';
import calculateRevenuePercentage from './calculateRevenueRate.js';
import createView from '../UI/index.js';
import { RetryError } from './errors.js';

let view = createView();
let lottoWithWinningNumbers;
let lottos = [];
let ranks = [];

const issueLottos = (purchasingPrice) => {
    lottos = issueLottoOf(purchasingPrice);

    const issuedAmount = lottos.length;
    view.purchasedTemplate(issuedAmount);

    lottos.map((lotto) => {
        view.lottoNumberTemplate(lotto.getLottoNumbers());
    });

    view.dividerTemplate();
};

const validate = (winningNumbers) => {
    lottoWithWinningNumbers = Lotto.of(winningNumbers);
};

const getRanks = (bonusNumber) => {
    const winningLotto = new WinningLotto(lottoWithWinningNumbers, bonusNumber);

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

const runOnce = async () => {
    try {
        await view.addPurchasingPriceHandler((purchasingPrice) =>
            issueLottos(purchasingPrice),
        );

        await view.addWinningNumberHandler((winningNumbers) =>
            validate(winningNumbers),
        );

        await view.addBonusNumberHandler((bonusNumber) =>
            getRanks(bonusNumber),
        );

        getStatistics();
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
                await view.addPurchasingPriceHandler((purchasingPrice) =>
                    issueLottos(purchasingPrice),
                );
                goToFlag = 2;
            }

            while (goToFlag === 2) {
                await view.addWinningNumberHandler((winningNumbers) =>
                    validate(winningNumbers),
                );
                goToFlag = 3;
            }

            while (goToFlag === 3) {
                await view.addBonusNumberHandler((bonusNumber) =>
                    getRanks(bonusNumber),
                );
                getStatistics();
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
