import AppError from '../AppError.js';
import ConsoleError from './ConsoleError.js';
import LottoGame from '../LottoGame.js';

const SEPARATOR = ',';

const convertToMatchingDataType = (input) => {
    if (input === 'null') return null;
    if (input === 'undefined') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(input)) return parseFloat(input);
    try {
        return JSON.parse(input);
    } catch {
        return input;
    }
};

const convertToArray = (input) =>
    input.split(SEPARATOR).map(convertToMatchingDataType);

const convertToLowerCase = (input) => input.trim().toLowerCase();

class RetryError extends ConsoleError {
    static #MESSAGE = 'Retry 입력값은 y나 n 중 하나여야합니다.';

    constructor() {
        super(RetryError.#MESSAGE);
    }
}

// AppError 발생 시 에러를 출력하고 재입력을 유도하는 헬퍼
async function retryOnAppError(view, action) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            await action();
            return;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }
}

async function askShouldRetry(view) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const input = await view.askRetry();
        const answer = convertToLowerCase(input);
        if (answer === 'y') return true;
        if (answer === 'n') return false;
        view.printError(new RetryError());
    }
}

async function playConsoleLotto(view, game) {
    // 1. 구입금액 입력
    await retryOnAppError(view, async () => {
        const budgetInput = await view.askBudget();
        const result = game.issueLottos(convertToMatchingDataType(budgetInput));
        view.printIssuedLottos(result);
    });

    // 2. 당첨 번호 입력
    await retryOnAppError(view, async () => {
        const winningNumbersInput = await view.askWinningNumbers();
        game.setWinningNumbers(convertToArray(winningNumbersInput));
    });

    // 3. 보너스 번호 입력
    await retryOnAppError(view, async () => {
        const bonusNumberInput = await view.askBonusNumber();
        game.setBonusNumber(convertToMatchingDataType(bonusNumberInput));
    });

    // 4. 통계 출력
    const statistics = game.getStatistics();
    view.printStatistics(statistics);
}

export default async function startConsoleLotto(view) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await playConsoleLotto(view, new LottoGame());

        if (!(await askShouldRetry(view))) {
            view.close();
            return;
        }
    }
}
