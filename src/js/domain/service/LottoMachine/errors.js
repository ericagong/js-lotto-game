import DomainError from '../../DomainError.js';

class LottoMachineError extends DomainError {
    static #TYPE = '[LottoMachineError]';

    constructor(message) {
        super(`${LottoMachineError.#TYPE} ${message}`);
    }
}

export class BudgetNotNumberError extends LottoMachineError {
    static #MESSAGE = '구매금액은 Number 타입이어야 합니다.';

    constructor() {
        super(BudgetNotNumberError.#MESSAGE);
    }
}

export class BudgetBelowMinError extends LottoMachineError {
    constructor(minBudget) {
        super(`구매금액은 ${minBudget.toLocaleString()} 이상의 값이어야 합니다.`);
    }
}

export class BudgetAboveMaxError extends LottoMachineError {
    constructor(maxBudget) {
        super(`구매금액은 ${maxBudget.toLocaleString()} 이하의 값이어야 합니다.`);
    }
}
