import ValidationError from '../ValidationError.js';

export async function runConsoleLotto(view, game) {
    // 1. 구입금액 입력
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const budget = await view.askBudget();
            const result = game.issueLottos(budget);
            view.showIssuedLottos(result);
            break;
        } catch (error) {
            if (!(error instanceof ValidationError)) throw error;
            view.showError(error);
        }
    }

    // 2. 당첨 번호 입력
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const winningNumbers = await view.askWinningNumbers();
            game.setWinningNumbers(winningNumbers);
            break;
        } catch (error) {
            if (!(error instanceof ValidationError)) throw error;
            view.showError(error);
        }
    }

    // 3. 보너스 번호 입력
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const bonusNumber = await view.askBonusNumber();
            game.setBonusNumber(bonusNumber);
            break;
        } catch (error) {
            if (!(error instanceof ValidationError)) throw error;
            view.showError(error);
        }
    }

    // 4. 통계 출력
    const statistics = game.getStatistics();
    view.showStatistics(statistics);
}
