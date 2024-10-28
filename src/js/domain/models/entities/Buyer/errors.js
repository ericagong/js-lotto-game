import ValidationError from '../../../ValidationError.js';

export class BuyerError extends ValidationError {
    static ERROR_TYPE = ' [Buyer Error] ';

    constructor(message) {
        super(BuyerError.ERROR_TYPE + message);
    }
}

export class BudgetNotNumberError extends BuyerError {
    static MESSAGE = 'budget은 Number 타입이어야합니다.';

    constructor() {
        super(BudgetNotNumberError.MESSAGE);
    }
}

export class BudgetBelowMinError extends BuyerError {
    static MESSAGE = 'budget은 1_000 이하의 값이어야합니다.';

    constructor() {
        super(BudgetBelowMinError.MESSAGE);
    }
}

export class BudgetAboveMaxError extends Error {
    static MESSAGE = 'budget은 100_000 이하의 값이어야합니다.';

    constructor() {
        super(BudgetAboveMaxError.MESSAGE);
    }
}
