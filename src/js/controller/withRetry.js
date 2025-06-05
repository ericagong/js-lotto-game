import ValidationError from '../ValidationError.js';
import { STATE } from './state.js';

const RETRY_OPTIONS = Object.freeze({
    YES: 'y',
    NO: 'n',
});

const retryHandler = (input) => {
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

const askRetry = async (view) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const input = await view.ask(STATE.RETRY);

        try {
            return retryHandler(input);
        } catch (error) {
            if (error instanceof RetryError) {
                view.handleError(error);
                continue;
            }
            // 예상 불가능한 에러 - 프로그램 종료
            throw error;
        }
    }
};

export default async function withRetry(runFunc, view, ...args) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await runFunc(view, ...args);

        const shouldRetry = await askRetry(view);
        if (!shouldRetry) break;
    }

    view.terminate();
}
