import { STATE } from './state.js';
import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import ValidationError from '../ValidationError.js';

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

export async function runConsoleStateMachine(view, { haltOnError = false }) {
    let currentState = STATE.PURCHASE;

    while (currentState !== STATE.END) {
        const stateHandler = stateHandlerRegistry[currentState];

        try {
            const input = await view.ask(currentState);

            const result = stateHandler(input);

            view.render(currentState, result);

            currentState = transitionRegistry[currentState];
        } catch (error) {
            if (error instanceof ValidationError) {
                view.handleError(error);
                if (haltOnError) throw error;
            } else {
                throw error;
            }
        }
    }

    if (haltOnError) {
        view.terminate();
    }
}
