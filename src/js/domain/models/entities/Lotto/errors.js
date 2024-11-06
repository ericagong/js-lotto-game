import ValidationError from '../../../../ValidationError.js';

export class LottoError extends ValidationError {
    static #TYPE = 'LottoError';

    constructor(message) {
        super(LottoError.#TYPE, message);
    }
}

export class NumbersNotArrayError extends LottoError {
    static #MESSAGE = 'numbers는 배열 형태여야합니다.';

    constructor() {
        super(NumbersNotArrayError.#MESSAGE);
    }
}

export class NumbersLengthNotSixError extends LottoError {
    static #MESSAGE = 'numbers는 길이가 6인 배열 형태여야합니다.';

    constructor() {
        super(NumbersLengthNotSixError.#MESSAGE);
    }
}

export class NumbersDuplicatedError extends LottoError {
    static #MESSAGE = 'numbers는 모두 중복되지 않아야합니다.';

    constructor() {
        super(NumbersDuplicatedError.#MESSAGE);
    }
}

export class TargetNotLottoNumberInstanceError extends LottoError {
    static #MESSAGE =
        'contains의 인자 target은 LottoNumber 인스턴스여야합니다.';

    constructor() {
        super(TargetNotLottoNumberInstanceError.#MESSAGE);
    }
}
