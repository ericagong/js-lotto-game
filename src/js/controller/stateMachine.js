import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import { convertToMatchingDataType, convertToArray } from '../UI/converter.js';
import { purchaseResultTemplate, statisticResultTemplate } from '../UI/console/templates.js';
import View from '../UI/index.js';
import ValidationError from '../ValidationError.js';

const STATE = Object.freeze({
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

const templateRegistry = Object.freeze({
    [STATE.PURCHASE]: purchaseResultTemplate,
    [STATE.STATISTICS]: statisticResultTemplate,
});

export async function runStateMachine({ haltOnError = false }) {
    let currentState = STATE.PURCHASE;

    while (currentState !== STATE.END) {
        const message = messageRegistry[currentState];
        const converter = converterReigstry[currentState];
        const stateHandler = stateHandlerRegistry[currentState];
        const template = templateRegistry[currentState];

        try {
            // 1. 사용자 입력 → 변환
            let input;
            if (message && converter) {
                input = await View.ask(message);
                input = converter(input);
            }

            // 2. 상태 처리 → 출력 데이터 반환
            const toViewData = stateHandler(input);

            // 3. 출력
            if (template && toViewData !== undefined) {
                template(toViewData);
            }

            // 4. 상태 전이
            currentState = transitionRegistry[currentState];
        } catch (error) {
            if (error instanceof ValidationError) {
                View.write(`[${error.type}] ${error.message}`);
                if (haltOnError) throw error;
            } else {
                throw error;
            }
        }
    }

    // 최종 종료 처리
    if (haltOnError) {
        View.terminate();
    }
}
