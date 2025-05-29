import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import { purchasedResultView, statisticResultView } from '../UI/web/outputViews.js';
import {
    priceFormView,
    setHandlerToPriceForm,
    winningLottoFormView,
    setHandlerToWinningLottoForm,
} from '../UI/web/inputViews.js';

const STATE = Object.freeze({
    PURCHASE: 'PURCHASE',
    WINNING_NUMBERS: 'WINNING_NUMBERS',
    STATISTICS: 'STATISTICS',
});

const transitionRegistry = Object.freeze({
    [STATE.PURCHASE]: STATE.WINNING_NUMBERS,
    [STATE.WINNING_NUMBERS]: STATE.STATISTICS,
});

const inputViewRegistry = Object.freeze({
    [STATE.PURCHASE]: {
        render: priceFormView,
        bind: setHandlerToPriceForm,
    },
    [STATE.WINNING_NUMBERS]: {
        render: winningLottoFormView,
        bind: setHandlerToWinningLottoForm,
    },
});

const domainHandlerRegistry = Object.freeze({
    [STATE.PURCHASE]: ({ price }) => issueLottosWithBudget(price),
    [STATE.WINNING_NUMBERS]: ({ winningNumbers, bonusNumber }) => {
        setWinningLottoNumbers(winningNumbers);
        setBonusNumbers(bonusNumber);
        return getStatistics();
    },
});

const outputViewRegistry = Object.freeze({
    [STATE.PURCHASE]: purchasedResultView,
    [STATE.WINNING_NUMBERS]: statisticResultView,
});

let currentState = STATE.PURCHASE;
export async function runStateMachine() {
    if (currentState === STATE.STATISTICS) return;

    const inputView = inputViewRegistry[currentState];
    const domainHandler = domainHandlerRegistry[currentState];
    const outputView = outputViewRegistry[currentState];

    // 1. 입력 렌더링
    inputView.render();

    // 2. 입력 이벤트 바인딩
    inputView.bind(async (inputData) => {
        try {
            // 3. 상태 처리
            const result = domainHandler(inputData);

            // 4. 출력 렌더링
            if (outputView && result !== undefined) {
                outputView(result);
            }

            // 5. 상태 전이 및 재귀 호출
            currentState = transitionRegistry[currentState];
            await runStateMachine(); // 다음 상태 실행
        } catch (error) {
            // TODO 에러 발생 시 직전 상태로 되돌리기 처리 필요
            alert(error.message);
        }
    });
}
