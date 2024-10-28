import ValidationError from '../../../ValidationError.js';

export class BuyerError extends ValidationError {
    static ERROR_TYPE = ' [Buyer Error] ';

    constructor(message) {
        super(BuyerError.ERROR_TYPE + message);
    }
}

export class NotNumberError extends BuyerError {
    static MESSAGE = 'budget은 number 타입이어야합니다.';

    constructor() {
        super(NotNumberError.MESSAGE);
    }
}

export class BelowMinBudgetError extends BuyerError {
    static MESSAGE = 'budget은 최소 1000원 이상이어야합니다.';

    constructor() {
        super(BelowMinBudgetError.MESSAGE);
    }
}

export class AboveMaxBudgetError extends Error {
    static MESSAGE = 'budget은 최대 100_000원 이하여야합니다.';

    constructor() {
        super(AboveMaxBudgetError.MESSAGE);
    }
}
