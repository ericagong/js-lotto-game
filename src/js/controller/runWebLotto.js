export function runWebLotto(view, game) {
    view.showPurchaseForm();

    view.onPurchaseSubmit((price) => {
        try {
            const result = game.issueLottos(price);
            view.showIssuedLottos(result);
            view.showWinningLottoForm();

            view.onWinningLottoSubmit(({ winningNumbers, bonusNumber }) => {
                try {
                    game.setWinningNumbers(winningNumbers);
                    game.setBonusNumber(bonusNumber);
                    const statistics = game.getStatistics();
                    view.showStatistics(statistics);
                } catch (error) {
                    view.showError(error);
                }
            });
        } catch (error) {
            view.showError(error);
        }
    });
}
