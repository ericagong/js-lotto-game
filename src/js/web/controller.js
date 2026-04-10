import AppError from '../AppError.js';

function handleError(view, error) {
    if (error instanceof AppError) {
        view.showError(error);
        return;
    }
    throw error;
}

export async function runWebLotto(view, game) {
    view.renderPurchaseForm();

    // 1. 구입금액
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const priceInput = await view.askPurchasePrice();
        try {
            const result = game.issueLottos(Number(priceInput));
            view.renderIssuedLottos(result);
            break;
        } catch (error) {
            handleError(view, error);
        }
    }

    // 2. 당첨번호 + 보너스번호
    view.renderWinningLottoForm();

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { winningNumbers, bonusNumber } = await view.askWinningLotto();
        try {
            game.setWinningNumbers(winningNumbers.map(Number));
            game.setBonusNumber(Number(bonusNumber));
            const statistics = game.getStatistics();
            view.renderStatistics(statistics);
            break;
        } catch (error) {
            handleError(view, error);
        }
    }
}
