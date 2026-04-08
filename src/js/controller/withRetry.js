import ValidationError from '../ValidationError.js';

class RetryError extends ValidationError {
    static #TYPE = 'RetryError';
    static #MESSAGE = 'Retry 입력값은 y나 n 중 하나여야합니다.';

    constructor() {
        super(RetryError.#TYPE, RetryError.#MESSAGE);
    }
}

export default async function withRetry(runGame, view) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await runGame();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const input = await view.askRetry();
            if (input === 'y') break;
            if (input === 'n') {
                view.close();
                return;
            }
            view.showError(new RetryError());
        }
    }
}
