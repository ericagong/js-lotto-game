import {
    issueLottosWithBudget,
    setWinningLottoNumbers,
    setBonusNumbers,
    getStatistics,
} from '../../controller/stateHandlers.js';
import { purchasedResultView, statisticResultView } from './outputViews.js';
import {
    priceFormView,
    setHandlerToPriceForm,
    winningLottoFormView,
    setHandlerToWinningLottoForm,
} from './inputViews.js';

const handleSubmitPrice = async ({ price }) => {
    const $priceInput = document.querySelector('#input-price');
    try {
        const { issuedCount, issuedLottosNumbers } = issueLottosWithBudget(price);

        purchasedResultView({
            issuedCount,
            issuedLottosNumbers,
        });

        // TODO 상태 머신으로 변경해 호출하게 처리
        purchased();
    } catch (error) {
        window.alert(error.message);
        $priceInput.value = '';
        return;
    }
};

const handleSubmitWinningLottoNumbers = async ({ winningNumbers, bonusNumber }) => {
    try {
        setWinningLottoNumbers(winningNumbers);
        setBonusNumbers(bonusNumber);
        const { rankSummary, revenueRate } = getStatistics();

        statisticResultView({ rankSummary, revenueRate });
    } catch (error) {
        window.alert(error.message);
        return;
    }
};

export const initialize = () => {
    priceFormView();
    setHandlerToPriceForm(handleSubmitPrice);
};

// TODO 상태 머신으로 변경해 호출하게 처리
const purchased = () => {
    winningLottoFormView();
    setHandlerToWinningLottoForm(handleSubmitWinningLottoNumbers);
};
