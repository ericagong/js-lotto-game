import View from '../UI/index.js';
import { step1, step2, step3, step4 } from './steps.js';
import ValidationError from '../ValidationError.js';

export default async function runOnce() {
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
}
