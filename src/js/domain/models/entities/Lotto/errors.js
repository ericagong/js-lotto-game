import ValidationError from '../../../ValidationError.js';

export class LottoError extends ValidationError {
    static ERROR_TYPE = ' [Lotto Error] ';

    constructor(message) {
        super(LottoError.ERROR_TYPE + message);
    }
}

export class NumbersNotArrayError extends LottoError {
    static MESSAGE = 'numbers는 배열 형태여야합니다.';

    constructor() {
        super(NumbersNotArrayError.MESSAGE);
    }
}

export class NumbersLengthNotSixError extends LottoError {
    static MESSAGE = 'numbers는 길이가 6인 배열 형태여야합니다.';

    constructor() {
        super(NumbersLengthNotSixError.MESSAGE);
    }
}

export class NumbersDuplicatedError extends LottoError {
    static MESSAGE = 'numbers는 모두 중복되지 않아야합니다.';

    constructor() {
        super(NumbersDuplicatedError.MESSAGE);
    }
}
