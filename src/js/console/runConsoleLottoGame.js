import AppError from '../AppError.js';
import ConsoleError from './ConsoleError.js';
import LottoGame from '../LottoGame.js';
import view from './view/index.js';

const convertStringToNumber = (input) => Number(input.trim());

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
const SEPARATOR = ',';
const convertStringToArray = (input) => input.split(SEPARATOR).map(convertToMatchingDataType);

const convertStringToLowerCase = (input) => input.trim().toLowerCase();

async function playConsoleLottoGame() {
    const game = new LottoGame();

    // 1. 구입금액 입력
    while (true) {
        try {
            const budgetInput = await view.askBudget();
            const result = game.issueLottos(convertStringToNumber(budgetInput));
            view.printIssuedLottos(result);
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }

    // 2. 당첨 번호 입력
    while (true) {
        try {
            const winningNumbersInput = await view.askWinningNumbers();
            game.setWinningNumbers(convertStringToArray(winningNumbersInput));
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }

    // 3. 보너스 번호 입력
    while (true) {
        try {
            const bonusNumberInput = await view.askBonusNumber();
            game.setBonusNumber(convertStringToNumber(bonusNumberInput));
            break;
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }

    // 4. 통계 출력
    view.printStatistics(game.getStatistics());
}

class RetryError extends ConsoleError {
    static #MESSAGE = 'Retry 입력값은 y나 n 중 하나여야합니다.';

    constructor() {
        super(RetryError.#MESSAGE);
    }
}

function convertStringToRetryAnswer(input) {
    const answer = convertStringToLowerCase(input);
    if (answer === 'y') return true;
    if (answer === 'n') return false;
    throw new RetryError();
}

async function askShouldRetry() {
    while (true) {
        try {
            const input = await view.askRetry();
            return convertStringToRetryAnswer(input);
        } catch (error) {
            if (!(error instanceof AppError)) throw error;
            view.printError(error);
        }
    }
}

// step1에서는 재시작 없이 한 판만 진행한다.
// step2에서는 재시작 기능을 추가해 사용자 입력에 따라 반복 진행 여부를 결정한다.
export default async function runConsoleLottoGame(withRetry = false) {
    do {
        await playConsoleLottoGame();
    } while (withRetry && (await askShouldRetry()));

    view.close();
}
