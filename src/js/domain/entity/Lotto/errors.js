import DomainError from '../../DomainError.js';

class LottoError extends DomainError {
    static #TYPE = '[LottoError]';

    constructor(message) {
        super(`${LottoError.#TYPE} ${message}`);
    }
}

export class NumbersNotArrayError extends LottoError {
    static #MESSAGE = 'numbers는 배열 형태여야 합니다.';

    constructor() {
        super(NumbersNotArrayError.#MESSAGE);
    }
}

export class NumbersInvalidLengthError extends LottoError {
    constructor(digits) {
        super(`numbers는 길이가 ${digits}인 배열이어야 합니다.`);
    }
}

export class NumbersDuplicatedError extends LottoError {
    static #MESSAGE = 'numbers는 모두 중복되지 않아야 합니다.';

    constructor() {
        super(NumbersDuplicatedError.#MESSAGE);
    }
}

export class NotLottoNumberInstanceError extends LottoError {
    static #MESSAGE = '인자는 LottoNumber 인스턴스여야 합니다.';

    constructor() {
        super(NotLottoNumberInstanceError.#MESSAGE);
    }
}

export class NotLottoInstanceError extends LottoError {
    static #MESSAGE = '인자는 Lotto 인스턴스여야 합니다.';

    constructor() {
        super(NotLottoInstanceError.#MESSAGE);
    }
}
