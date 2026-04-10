import AppError from '../AppError.js';

// AppError 발생 시 에러를 출력하고 재입력을 유도하는 헬퍼
async function retryOnAppError(view, action) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            await action();
            return;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.showError(error);
        }
    }
}

export async function runConsoleLotto(view, game) {
    // 1. 구입금액 입력
    await retryOnAppError(view, async () => {
        const budget = await view.askBudget();
        const result = game.issueLottos(budget);
        view.showIssuedLottos(result);
    });

    // 2. 당첨 번호 입력
    await retryOnAppError(view, async () => {
        const winningNumbers = await view.askWinningNumbers();
        game.setWinningNumbers(winningNumbers);
    });

    // 3. 보너스 번호 입력
    await retryOnAppError(view, async () => {
        const bonusNumber = await view.askBonusNumber();
        game.setBonusNumber(bonusNumber);
    });

    // 4. 통계 출력
    const statistics = game.getStatistics();
    view.showStatistics(statistics);
}
