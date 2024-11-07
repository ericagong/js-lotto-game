import ValidationError from '../ValidationError.js';

export class RetryError extends ValidationError {
    static #TYPE = 'RetryError';
    static #MESSAGE = 'Retry 입력값은 y나 n 중 하나여야합니다.';

    constructor() {
        super(RetryError.#TYPE, RetryError.#MESSAGE);
    }
}
