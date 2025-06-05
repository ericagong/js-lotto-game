import { STATE } from './state.js';
import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';

const transitionRegistry = Object.freeze({
    [STATE.PURCHASE]: STATE.WINNING_NUMBERS,
    [STATE.WINNING_NUMBERS]: STATE.STATISTICS,
});

const domainHandlerRegistry = Object.freeze({
    [STATE.PURCHASE]: ({ price }) => issueLottosWithBudget(price),
    [STATE.WINNING_NUMBERS]: ({ winningNumbers, bonusNumber }) => {
        setWinningLottoNumbers(winningNumbers);
        setBonusNumbers(bonusNumber);
        return getStatistics();
    },
});

let currentState = STATE.PURCHASE;
export async function runWebStateMachine(view) {
    if (currentState === STATE.STATISTICS) return;

    await view.ask(currentState);

    view.bindDomainLogicHandler(currentState, async (inputData) => {
        try {
            const domainHandler = domainHandlerRegistry[currentState];
            const result = domainHandler(inputData);

            view.render(currentState, result);
            currentState = transitionRegistry[currentState];

            await runWebStateMachine(view);
        } catch (error) {
            // TODO 에러 발생 시 직전 상태로 되돌리기 처리 필요
            view.handleError(error);
        }
    });
}
