import ValidationError from '../../ValidationError.js';

class RankError extends ValidationError {
    static ERROR_TYPE = ' [Rank Error] ';

    constructor(message) {
        super(RankError.ERROR_TYPE + message);
    }
}

export class NotInitializedIndexError extends RankError {
    static MESSAGE = '사전에 정의된 index(1, 2, 3, 4, 5, 6)가 아닙니다.';

    constructor() {
        super(NotInitializedIndexError.MESSAGE);
    }
}

export class IndexNotNumberError extends RankError {
    static MESSAGE = 'index는 number 타입이어야 합니다.';

    constructor() {
        super(IndexNotNumberError.MESSAGE);
    }
}

export class PrizeNotNumberError extends RankError {
    static MESSAGE = 'prize는 number 타입이어야 합니다.';

    constructor() {
        super(PrizeNotNumberError.MESSAGE);
    }
}

export class isBonusMatchNotBooleanError extends RankError {
    static MESSAGE = 'isBonusMatch는 boolean 타입이여야합니다.';

    constructor() {
        super(isBonusMatchNotBooleanError.MESSAGE);
    }
}

export class MatchCountNotNumberError extends RankError {
    static MESSAGE = 'matchCount는 number 타입이어야합니다.';

    constructor() {
        super(MatchCountNotNumberError.MESSAGE);
    }
}
