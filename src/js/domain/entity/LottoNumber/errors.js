import DomainError from '../../DomainError.js';

class LottoNumberError extends DomainError {
    static #TYPE = '[LottoNumberError]';

    constructor(message) {
        super(`${LottoNumberError.#TYPE} ${message}`);
    }
}

export class ValueNotNumberError extends LottoNumberError {
    static #MESSAGE = 'value는 Number 타입이여야합니다.';

    constructor() {
        super(ValueNotNumberError.#MESSAGE);
    }
}

export class ValueNotIntegerError extends LottoNumberError {
    static #MESSAGE = 'value는 정수 형태이어야합니다.';

    constructor() {
        super(ValueNotIntegerError.#MESSAGE);
    }
}

export class ValueOutOfRangeError extends LottoNumberError {
    constructor(lowerBound, upperBound) {
        super(`value는 [${lowerBound}, ${upperBound}] 사이의 정수 형태이어야합니다.`);
    }
}
