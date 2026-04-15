import DomainError from '../../DomainError.js';

class RanksError extends DomainError {
    static #TYPE = '[RanksError]';

    constructor(message) {
        super(`${RanksError.#TYPE} ${message}`);
    }
}

export class RanksNotArrayError extends RanksError {
    static #MESSAGE = 'ranks는 배열이어야 합니다.';

    constructor() {
        super(RanksNotArrayError.#MESSAGE);
    }
}

export class RankNotRankInstanceError extends RanksError {
    static #MESSAGE = 'ranks의 모든 원소는 Rank 인스턴스여야 합니다.';

    constructor() {
        super(RankNotRankInstanceError.#MESSAGE);
    }
}
