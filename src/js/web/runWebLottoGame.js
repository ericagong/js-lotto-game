import CoreError from '../CoreError.js';
import LottoGame from '../domain/LottoGame.js';
import WebView from './view/index.js';

const runWebLottoGame = () => {
    const view = new WebView();
    const game = new LottoGame();

    const handleWinningLotto = ({ winningNumbers, bonusNumber }) => {
        try {
            game.setWinningLotto(winningNumbers.map(Number), Number(bonusNumber));
            view.renderStatistics(game.getStatistics());
        } catch (error) {
            if (!(error instanceof CoreError)) throw error;
            view.showError(error);
        }
    };

    const handlePurchase = (priceInput) => {
        try {
            const result = game.issueLottos(Number(priceInput));
            view.renderIssuedLottos(result);
            view.renderWinningLottoForm();
            view.onWinningLottoSubmit(handleWinningLotto);
        } catch (error) {
            if (!(error instanceof CoreError)) throw error;
            view.showError(error);
        }
    };

    view.renderPurchaseForm();
    view.onPurchaseSubmit(handlePurchase);
};

export default runWebLottoGame;
