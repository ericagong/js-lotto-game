import View from '../UI/index.js';
import { step1, step2, step3, step4 } from './steps.js';
import { RetryError } from './errors.js';
import ValidationError from '../ValidationError.js';

export default async function runUntilFinish() {
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
}
