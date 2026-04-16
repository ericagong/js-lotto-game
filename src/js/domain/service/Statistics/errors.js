import DomainError from '../../DomainError.js';

class StatisticsError extends DomainError {
    static #TYPE = '[StatisticsError]';

    constructor(message) {
        super(`${StatisticsError.#TYPE} ${message}`);
    }
}

export class RanksNotRanksInstanceError extends StatisticsError {
    static #MESSAGE = 'ranks는 Ranks 인스턴스여야 합니다.';

    constructor() {
        super(RanksNotRanksInstanceError.#MESSAGE);
    }
}

export class TotalCostNotPositiveNumberError extends StatisticsError {
    static #MESSAGE = 'totalCost는 0보다 큰 Number 타입이어야 합니다.';

    constructor() {
        super(TotalCostNotPositiveNumberError.#MESSAGE);
    }
}
