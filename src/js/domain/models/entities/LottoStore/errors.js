import ValidationError from '../../../../ValidationError.js';

export class LottoStoreError extends ValidationError {
    static #TYPE = 'LottoStoreError';

    constructor(message) {
        super(LottoStoreError.#TYPE, message);
    }
}

export class BudgetNotNumberError extends LottoStoreError {
    static MESSAGE = 'budget은 Number 타입이어야합니다.';

    constructor() {
        super(BudgetNotNumberError.MESSAGE);
    }
}

export class BudgetBelowMinError extends LottoStoreError {
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
