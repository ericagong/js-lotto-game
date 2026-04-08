export function runWebLotto(view, game) {
    view.renderPurchaseForm();

    view.onPurchaseSubmit((price) => {
        try {
            const result = game.issueLottos(price);
            view.renderIssuedLottos(result);
            view.renderWinningLottoForm();

            view.onWinningLottoSubmit(({ winningNumbers, bonusNumber }) => {
                try {
                    game.setWinningNumbers(winningNumbers);
                    game.setBonusNumber(bonusNumber);
                    const statistics = game.getStatistics();
                    view.renderStatistics(statistics);
                } catch (error) {
                    view.alertError(error);
                }
            });
        } catch (error) {
            view.alertError(error);
        }
    });
}
