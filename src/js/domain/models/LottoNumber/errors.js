import ValidationError from '../../ValidationError.js';

export class LottoNumberError extends ValidationError {
    static ERROR_TYPE = ' [LottoNumber Error] ';

    constructor(message) {
        super(LottoNumberError.ERROR_TYPE + message);
    }
}

export class LottoNumberNotNumberError extends LottoNumberError {
    static MESSAGE = '로또 번호는 숫자 타입이여야합니다.';

    constructor() {
        super(LottoNumberNotNumberError.MESSAGE);
    }
}

export class LottoNumberNotIntegerError extends LottoNumberError {
    static MESSAGE = '로또 번호는 정수여야합니다.';

    constructor() {
        super(LottoNumberNotIntegerError.MESSAGE);
    }
}

export class LottoNumberOutOfRangeError extends LottoNumberError {
    static MESSAGE = `로또 번호는 [1, 45] 사이의 숫자여야합니다.`;

    constructor() {
        super(LottoNumberOutOfRangeError.MESSAGE);
    }
}
