import ValidationError from '../../../ValidationError.js';

class RankError extends ValidationError {
    static #TYPE = 'RankError';

    constructor(message) {
        super(RankError.#TYPE, message);
    }
}

export class IndexNotNumberError extends RankError {
    static #MESSAGE = 'index는 number 타입이어야 합니다.';

    constructor() {
        super(IndexNotNumberError.#MESSAGE);
    }
}

export class PrizeNotNumberError extends RankError {
    static #MESSAGE = 'prize는 number 타입이어야 합니다.';

    constructor() {
        super(PrizeNotNumberError.#MESSAGE);
    }
}

export class GetMatchCountError extends RankError {
    static #MESSAGE = 'Rank.NONE의 matchCount에는 접근할 수 없습니다.';

    constructor() {
        super(GetMatchCountError.#MESSAGE);
    }
}

export class GetIsBonusMatchError extends RankError {
    static #MESSAGE =
        'Rank.SECOND, Rank.THIRD만 isBonusMatch에 접근할 수 있습니다.';

    constructor() {
        super(GetIsBonusMatchError.#MESSAGE);
    }
}
