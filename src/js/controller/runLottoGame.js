import { STEPS } from '../utils.js';
import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './controller.js';
import View from '../UI/index.js';
import ValidationError from '../ValidationError.js';

export default async function runLottoGame() {
    const stepSequence = [STEPS.PURCHASE, STEPS.WINNING_NUMBERS, STEPS.BONUS_NUMBER, STEPS.STATISTICS];
    const logicRegistry = {
        [STEPS.PURCHASE]: issueLottosWithBudget,
        [STEPS.WINNING_NUMBERS]: setWinningLottoNumbers,
        [STEPS.BONUS_NUMBER]: setBonusNumbers,
        [STEPS.STATISTICS]: getStatistics,
    };

    try {
        await View.createStepper(stepSequence)(logicRegistry);
    } catch (error) {
        if (error instanceof ValidationError) {
            // 예상 가능한 에러 - 에러 출력
            View.errorMessageTemplate(error.type, error.message);
            console.log('here, ', error.type, error.message);
        } else {
            // 예상 불가능한 에러 - 프로그램 종료
            console.log(error);
            throw error;
        }
    } 
    // finally {
    //     View.close();
    // }
}
