import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import PriceInputView from '../UI/web/PriceInputView.js';
import PurchasedLottosView from '../UI/web/PurchasedLottosView.js';
import WinningNumberInputView from '../UI/web/WinningNumberInputView.js';
import StatisticsModalView from '../UI/web/StatisticsModalView.js';

export function initApp() {
    new PriceInputView({
        onSubmit: (price) => {
            const result = issueLottosWithBudget(price);
            new PurchasedLottosView(result);

            new WinningNumberInputView({
                onSubmit: ({ winningNumbers, bonusNumber }) => {
                    setWinningLottoNumbers(winningNumbers);
                    setBonusNumbers(bonusNumber);
                    new StatisticsModalView(getStatistics());
                },
            });
        },
    });
}
