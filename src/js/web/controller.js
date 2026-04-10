import AppError from '../AppError.js';

function handleError(view, error) {
    if (error instanceof AppError) {
        view.showError(error);
        return;
    }
    throw error;
}

export function runWebLotto(view, game) {
    view.renderPurchaseForm();

    view.onPurchaseSubmit(() => {
        try {
            const price = view.getPurchasePrice();
            const result = game.issueLottos(price);
            view.renderIssuedLottos(result);
            view.renderWinningLottoForm();

            view.onWinningLottoSubmit(() => {
                try {
                    const { winningNumbers, bonusNumber } = view.getWinningLottoInput();
                    game.setWinningNumbers(winningNumbers);
                    game.setBonusNumber(bonusNumber);
                    const statistics = game.getStatistics();
                    view.renderStatistics({
                        ...statistics,
                        rankSummary: [...statistics.rankSummary].reverse(),
                    });
                } catch (error) {
                    handleError(view, error);
                }
            });
        } catch (error) {
            handleError(view, error);
        }
    });
}
