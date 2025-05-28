import View from '../UI/index.js';
import RetryError from './RetryError.js';

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

const GUIDE_MESSAGE = '\n> 다시 시작하시겠습니까? (y/n) ';
const askRetry = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const input = await View.readlineFromConsole(GUIDE_MESSAGE);
        const convertedInput = converter(input);

        try {
            return handler(convertedInput);
        } catch (error) {
            if (error instanceof RetryError) {
                View.errorMessageTemplate(error.type, error.message);
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

    View.close();
}
