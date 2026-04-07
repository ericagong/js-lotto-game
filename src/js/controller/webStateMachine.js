import { issueLottosWithBudget, setWinningLottoNumbers, setBonusNumbers, getStatistics } from './stateHandlers.js';
import PurchaseView from '../UI/web/PurchaseView.js';
import WinningNumbersView from '../UI/web/WinningNumbersView.js';

export function initApp() {
    const purchaseView = new PurchaseView();
    const winningNumbersView = new WinningNumbersView();

    purchaseView.renderForm();
    purchaseView.onSubmit(({ price }) => {
        try {
            const result = issueLottosWithBudget(price);
            purchaseView.renderResult(result);

            winningNumbersView.renderForm();
            winningNumbersView.onSubmit(({ winningNumbers, bonusNumber }) => {
                try {
                    setWinningLottoNumbers(winningNumbers);
                    setBonusNumbers(bonusNumber);
                    winningNumbersView.renderResult(getStatistics());
                } catch (error) {
                    alert(error.message);
                }
            });
        } catch (error) {
            alert(error.message);
        }
    });
}
