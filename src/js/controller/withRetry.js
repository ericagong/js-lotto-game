import ValidationError from '../ValidationError.js';
import View from '../UI/index.js';

const converter = (input) => {
    return input.trim().toLowerCase();
};

const RETRY_OPTIONS = Object.freeze({
    YES: 'y',
    NO: 'n',
});
const handler = (input) => {
    switch (input) {
        case RETRY_OPTIONS.YES:
            return true;
        case RETRY_OPTIONS.NO:
            return false;
        default:
            throw new RetryError();
    }
};

class RetryError extends ValidationError {
    static #TYPE = 'RetryError';
    static #MESSAGE = 'Retry 입력값은 y나 n 중 하나여야합니다.';

    constructor() {
        super(RetryError.#TYPE, RetryError.#MESSAGE);
    }
}

const GUIDE_MESSAGE = '\n> 다시 시작하시겠습니까? (y/n) ';
const askRetry = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const input = await View.ask(GUIDE_MESSAGE);
        const convertedInput = converter(input);

        try {
            return handler(convertedInput);
        } catch (error) {
            if (error instanceof RetryError) {
                View.write(`[${error.type}] ${error.message}`);
                continue;
            }
            // 예상 불가능한 에러 - 프로그램 종료
            throw error;
        }
    }
};

export default async function withRetry(runFunc, ...args) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await runFunc(...args);

        const shouldRetry = await askRetry();
        if (!shouldRetry) break;
    }

    View.terminate();
}
