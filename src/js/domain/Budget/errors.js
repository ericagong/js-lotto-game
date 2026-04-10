import DomainError from '../DomainError.js';

class BudgetError extends DomainError {
    static #TYPE = '[BudgetError]';

    constructor(message) {
        super(`${BudgetError.#TYPE} ${message}`);
    }
}

export class BudgetNotNumberError extends BudgetError {
    static #MESSAGE = 'budget은 Number 타입이어야합니다.';

    constructor() {
        super(BudgetNotNumberError.#MESSAGE);
    }
}

export class BudgetBelowMinError extends BudgetError {
    static #MESSAGE = 'budget은 1_000 이상의 값이어야합니다.';

    constructor() {
        super(BudgetBelowMinError.#MESSAGE);
    }
}

export class BudgetAboveMaxError extends BudgetError {
    static #MESSAGE = 'budget은 100_000 이하의 값이어야합니다.';

    constructor() {
        super(BudgetAboveMaxError.#MESSAGE);
    }
}
