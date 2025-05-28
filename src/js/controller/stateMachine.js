import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './controller.js';
import { convertToMatchingDataType, convertToArray } from '../UI/inputConverter.js';
import View from '../UI/index.js';
import ValidationError from '../ValidationError.js';

export const STATE = Object.freeze({
    PURCHASE: 'PURCHASE',
    WINNING_NUMBERS: 'WINNING_NUMBERS',
    BONUS_NUMBER: 'BONUS_NUMBER',
    STATISTICS: 'STATISTICS',
    END: 'END',
});

const messageRegistry = Object.freeze({
    [STATE.PURCHASE]: '> 구입금액을 입력해 주세요. ',
    [STATE.WINNING_NUMBERS]: '\n> 당첨 번호를 입력해 주세요. ',
    [STATE.BONUS_NUMBER]: '\n> 보너스 번호를 입력해 주세요. ',
    // [STATE.STATISTICS]: '',
});

const converterReigstry = Object.freeze({
    [STATE.PURCHASE]: convertToMatchingDataType,
    [STATE.WINNING_NUMBERS]: convertToArray,
    [STATE.BONUS_NUMBER]: convertToMatchingDataType,
    // [STATE.STATISTICS]: () => {},
});

const transitionRegistry = Object.freeze({
    [STATE.PURCHASE]: STATE.WINNING_NUMBERS,
    [STATE.WINNING_NUMBERS]: STATE.BONUS_NUMBER,
    [STATE.BONUS_NUMBER]: STATE.STATISTICS,
    [STATE.STATISTICS]: STATE.END,
});

const stateHandlerRegistry = Object.freeze({
    [STATE.PURCHASE]: issueLottosWithBudget,
    [STATE.WINNING_NUMBERS]: setWinningLottoNumbers,
    [STATE.BONUS_NUMBER]: setBonusNumbers,
    [STATE.STATISTICS]: getStatistics,
});

export async function runStateMachine({ haltOnError = false }) {
    let currentState = STATE.PURCHASE;

    while (currentState !== STATE.END) {
        const message = messageRegistry[currentState];
        const converter = converterReigstry[currentState];
        const stateHandler = stateHandlerRegistry[currentState];

        try {
            if (!message || !converter) {
                stateHandler();
            } else {
                const input = await View.readlineFromConsole(message);
                const converted = converter(input);
                stateHandler(converted);
            }
            currentState = transitionRegistry[currentState];
        } catch (error) {
            if (error instanceof ValidationError) {
                // 예상 가능한 에러 - 에러 출력
                View.errorMessageTemplate(error.type, error.message);
                // haltOnError 옵션 -> 에러 발생 시 종료
                if (haltOnError) {
                    throw error;
                }
            } else {
                // 예상 불가능한 에러 - 프로그램 종료
                throw error;
            }
        } finally {
            if (haltOnError && currentState === STATE.END) {
                View.close();
            }
        }
    }
}
