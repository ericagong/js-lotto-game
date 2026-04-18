import { readLine, printLine, close } from './ConsoleIO.js';
import ConsoleError from '../ConsoleError.js';
import {
    BUDGET_PROMPT,
    WINNING_NUMBERS_PROMPT,
    BONUS_NUMBER_PROMPT,
    RETRY_PROMPT,
    formatIssuedCount,
    STATISTICS_HEADER,
    formatRankRow,
    formatRevenueRate,
    formatError,
} from './templates.js';

class EmptyInputError extends ConsoleError {
    constructor(fieldName) {
        super(`${fieldName}은(는) 빈 값일 수 없습니다.`);
    }
}

const validateNotEmpty = (input, fieldName) => {
    if (input.trim() === '') throw new EmptyInputError(fieldName);
};

const ConsoleView = {
    async askBudget() {
        const input = await readLine(BUDGET_PROMPT);
        validateNotEmpty(input, '구입금액');
        return input;
    },
    async askWinningNumbers() {
        const input = await readLine(WINNING_NUMBERS_PROMPT);
        validateNotEmpty(input, '당첨 번호');
        return input;
    },
    async askBonusNumber() {
        const input = await readLine(BONUS_NUMBER_PROMPT);
        validateNotEmpty(input, '보너스 번호');
        return input;
    },
    async askRetry() {
        const input = await readLine(RETRY_PROMPT);
        validateNotEmpty(input, '재시작 여부');
        return input;
    },

    printIssuedLottos({ issuedCount, issuedLottosNumbers }) {
        printLine(formatIssuedCount(issuedCount));
        issuedLottosNumbers.forEach((nums) => printLine(nums));
    },

    printStatistics({ rankSummary, revenueRate }) {
        printLine(STATISTICS_HEADER);
        rankSummary.forEach((rank) => printLine(formatRankRow(rank)));
        printLine(formatRevenueRate(revenueRate));
    },

    printError(error) {
        printLine(formatError(error.type, error.message));
    },

    close,
};

export default ConsoleView;
