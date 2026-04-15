import DomainError from '../../DomainError.js';

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
    constructor(minAmount) {
        super(`budget은 ${minAmount.toLocaleString()} 이상의 값이어야합니다.`);
    }
}

export class BudgetAboveMaxError extends BudgetError {
    constructor(maxAmount) {
        super(`budget은 ${maxAmount.toLocaleString()} 이하의 값이어야합니다.`);
    }
}
