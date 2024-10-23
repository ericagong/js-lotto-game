import ValidationError from '../../ValidationError.js';

export class LottoNumberError extends ValidationError {
    static ERROR_TYPE = ' [LottoNumber Error] ';

    constructor(message) {
        super(LottoNumberError.ERROR_TYPE + message);
    }
}

export class NotNumberError extends LottoNumberError {
    static MESSAGE = 'lottoNumber는 number 타입이여야합니다.';

    constructor() {
        super(NotNumberError.MESSAGE);
    }
}

export class NotIntegerError extends LottoNumberError {
    static MESSAGE = 'lottoNumber는 정수 형태이어야합니다.';

    constructor() {
        super(NotIntegerError.MESSAGE);
    }
}

// [ ] 순환 참조 이슈
export class OutOfRangeError extends LottoNumberError {
    static MESSAGE = `lottoNumber는 [1, 45] 사이의 정수 형태이어야합니다.`;

    constructor() {
        super(OutOfRangeError.MESSAGE);
    }
}
