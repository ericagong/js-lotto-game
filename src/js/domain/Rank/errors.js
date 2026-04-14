import DomainError from '../DomainError.js';

class RankError extends DomainError {
    static #TYPE = '[RankError]';

    constructor(message) {
        super(`${RankError.#TYPE} ${message}`);
    }
}

export class PrizeNotNumberError extends RankError {
    static #MESSAGE = 'prize는 number 타입이어야 합니다.';

    constructor() {
        super(PrizeNotNumberError.#MESSAGE);
    }
}
