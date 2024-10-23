import issueLottoOf from '../domain/models/LottoMachine/issueLottoOf.js';
import Lotto from '../domain/models/Lotto/Lotto.js';
import Rank, { determineRank } from '../domain/models/Rank/Rank.js';
import WinningLotto from '../domain/models/WinningLotto/WinningLotto.js';
import countRanks from '../domain/models/Statistics/countRanks.js';
import calculateRevenueRate from '../domain/models/Statistics/calculateRevenueRate.js';
import createView from '../UI/index.js';
import { RetryError } from './errors.js';

let view = createView();
let lottoWithWinningNumbers;
let lottos = [];
let ranks = [];

function issueLottos(purchasingPrice) {
    lottos = issueLottoOf(purchasingPrice);
    const issuedAmount = lottos.length;
    const lottoNumbers = lottos.map((lotto) => lotto.getLottoNumbers());

    view.purchasedTemplate(issuedAmount);
    view.lottoNumbersTemplate(lottoNumbers);
}

function validate(winningNumbers) {
    lottoWithWinningNumbers = Lotto.of(winningNumbers);
}

function getRanks(bonusNumber) {
    const winningLotto = new WinningLotto(lottoWithWinningNumbers, bonusNumber);

    Rank.initializeRanks();

    lottos.forEach((lotto) => {
        const lottoNumbers = lotto.getLottoNumbers();

        const matchCount = winningLotto.countMatch(lottoNumbers);
        const isBonusMatch = winningLotto.isBonusMatch(lottoNumbers);

        const rank = determineRank(matchCount, isBonusMatch);
        ranks.push(rank);
    });
}

function getStatistics() {
    const rankCount = countRanks(ranks);
    view.statisticsTemplate(rankCount);

    const revenueRate = calculateRevenueRate(ranks);
    view.totalRevenueTemplate(revenueRate);
}

async function runOnce() {
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
}

async function runUntilFinish() {
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
}

export { runOnce, runUntilFinish };
