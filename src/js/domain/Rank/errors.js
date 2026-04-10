import DomainError from '../DomainError.js';

class RankError extends DomainError {
    static #TYPE = '[RankError]';

    constructor(message) {
        super(`${RankError.#TYPE} ${message}`);
    }
}

export class MatchCountNotNumberError extends RankError {
    static #MESSAGE = 'matchCount는 number 타입이어야합니다.';

    constructor() {
        super(MatchCountNotNumberError.#MESSAGE);
    }
}

export class PrizeNotNumberError extends RankError {
    static #MESSAGE = 'prize는 number 타입이어야 합니다.';

    constructor() {
        super(PrizeNotNumberError.#MESSAGE);
    }
}

export class IsBonusMatchNotBooleanError extends RankError {
    static #MESSAGE = 'isBonusMatch는 boolean 타입이여야합니다.';

    constructor() {
        super(IsBonusMatchNotBooleanError.#MESSAGE);
    }
}
