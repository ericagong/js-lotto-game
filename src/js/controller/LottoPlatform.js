import issueLottoOf from '../domain/models/LottoMachine/issueLottoOf.js';
import Lotto from '../domain/models/Lotto/Lotto.js';
import { determineRank } from '../domain/models/Rank/Rank.js';
import WinningLotto from '../domain/models/WinningLotto/WinningLotto.js';
import countRanks from '../domain/models/Statistics/countRanks.js';
import calculateRevenueRate from '../domain/models/Statistics/calculateRevenueRate.js';
import createView from '../UI/index.js';
import { RetryError } from './errors.js';

// TODO class 아닌 형태로 구현 변경!!
export default class LottoPlatform {
    #view;
    #lottoWithWinningNumbers;
    #lottos = [];
    #ranks = [];

    constructor() {
        this.#view = createView();
    }

    #issueLottos(purchasingPrice) {
        this.#lottos = issueLottoOf(purchasingPrice);
        const issuedAmount = this.#lottos.length;
        const lottoNumbers = this.#lottos.map((lotto) =>
            lotto.getLottoNumbers(),
        );

        this.#view.purchasedTemplate(issuedAmount);
        this.#view.lottoNumbersTemplate(lottoNumbers);
    }

    #validate(winningNumbers) {
        this.#lottoWithWinningNumbers = Lotto.of(winningNumbers);
    }

    #getRanks(bonusNumber) {
        const winningLotto = new WinningLotto(
            this.#lottoWithWinningNumbers,
            bonusNumber,
        );

        this.#lottos.forEach((lotto) => {
            const lottoNumbers = lotto.getLottoNumbers();

            const matchCount = winningLotto.countMatch(lottoNumbers);
            const isBonusMatch = winningLotto.isBonusMatch(lottoNumbers);

            this.#ranks.push(determineRank(matchCount, isBonusMatch));
        });
    }

    #getStatistics() {
        const rankCount = countRanks(this.#ranks);
        this.#view.statisticsTemplate(rankCount);

        const revenueRate = calculateRevenueRate(this.#ranks);
        this.#view.totalRevenueTemplate(revenueRate);
    }

    // TODO bind 통해 2개로 만들기?
    // TODO generator 로 순서 지정?
    async runOnce() {
        try {
            await this.#view.addPurchasingPriceHandler((purchasingPrice) =>
                this.#issueLottos(purchasingPrice),
            );

            await this.#view.addWinningNumberHandler((winningNumbers) =>
                this.#validate(winningNumbers),
            );

            await this.#view.addBonusNumberHandler((bonusNumber) =>
                this.#getRanks(bonusNumber),
            );

            this.#getStatistics();
        } catch (error) {
            this.#view.errorMessageTemplate(error.message);
        } finally {
            this.#view.close();
        }
    }

    async runUntilFinish() {
        let goToFlag = 1;

        while (goToFlag !== 5) {
            try {
                while (goToFlag === 1) {
                    await this.#view.addPurchasingPriceHandler(
                        (purchasingPrice) => this.#issueLottos(purchasingPrice),
                    );
                    goToFlag = 2;
                }

                while (goToFlag === 2) {
                    await this.#view.addWinningNumberHandler((winningNumbers) =>
                        this.#validate(winningNumbers),
                    );
                    goToFlag = 3;
                }

                while (goToFlag === 3) {
                    await this.#view.addBonusNumberHandler((bonusNumber) =>
                        this.#getRanks(bonusNumber),
                    );
                    this.#getStatistics();
                    goToFlag = 4;
                }

                while (goToFlag === 4) {
                    await this.#view.addRetryHandler((retry) => {
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
                this.#view.errorMessageTemplate(error.message);
            }
        }

        this.#view.close();
    }
}
