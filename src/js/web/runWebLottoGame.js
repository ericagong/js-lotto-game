import AppError from '../AppError.js';
import LottoGame from '../LottoGame.js';
import WebView from './view/index.js';

export default function runWebLottoGame() {
    const view = new WebView();
    const game = new LottoGame();

    function handlePurchase(priceInput) {
        try {
            const result = game.issueLottos(Number(priceInput));
            view.renderIssuedLottos(result);
            view.renderWinningLottoForm();
            view.onWinningLottoSubmit(handleWinningLotto);
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }

    function handleWinningLotto({ winningNumbers, bonusNumber }) {
        try {
            game.setWinningNumbers(winningNumbers.map(Number));
            game.setBonusNumber(Number(bonusNumber));
            view.renderStatistics(game.getStatistics());
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }

    view.renderPurchaseForm();
    view.onPurchaseSubmit(handlePurchase);
}
