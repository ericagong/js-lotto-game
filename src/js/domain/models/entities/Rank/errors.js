import ValidationError from '../../../../ValidationError.js';

class RankError extends ValidationError {
    static #TYPE = 'RankError';

    constructor(message) {
        super(RankError.#TYPE, message);
    }
}

export class PrivateConstructorError extends RankError {
    static #MESSAGE = 'Rank는 new 키워드로 인스턴스를 생성할 수 없습니다.';

    constructor() {
        super(PrivateConstructorError.#MESSAGE);
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
