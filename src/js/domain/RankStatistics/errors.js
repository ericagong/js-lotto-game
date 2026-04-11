import DomainError from '../DomainError.js';

class RankStatisticsError extends DomainError {
    static #TYPE = '[RankStatisticsError]';

    constructor(message) {
        super(`${RankStatisticsError.#TYPE} ${message}`);
    }
}

export class RanksNotArrayError extends RankStatisticsError {
    static #MESSAGE = 'ranks는 배열 형태여야합니다.';

    constructor() {
        super(RanksNotArrayError.#MESSAGE);
    }
}

export class RankNotRankInstanceError extends RankStatisticsError {
    static #MESSAGE = 'ranks의 모든 원소는 Rank 인스턴스여야합니다.';

    constructor() {
        super(RankNotRankInstanceError.#MESSAGE);
    }
}

export class TotalCostNotPositiveNumberError extends RankStatisticsError {
    static #MESSAGE = 'totalCost는 0보다 큰 Number 타입이어야합니다.';

    constructor() {
        super(TotalCostNotPositiveNumberError.#MESSAGE);
    }
}
