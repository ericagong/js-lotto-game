import { STATE } from './state.js';
import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import { purchaseResultTemplate, statisticsResultTemplate } from '../UI/console/templates.js';
import View from '../UI/index.js';
import ValidationError from '../ValidationError.js';
import { messageRegistry, converterReigstry } from '../UI/console/inputViews.js';

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
    [STATE.STATISTICS]: statisticsResultTemplate,
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
