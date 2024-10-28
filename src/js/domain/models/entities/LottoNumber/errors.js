import ValidationError from '../../../ValidationError.js';

export class LottoNumberError extends ValidationError {
    static ERROR_TYPE = ' [LottoNumber Error] ';

    constructor(message) {
        super(LottoNumberError.ERROR_TYPE + message);
    }
}

export class ValueNotNumberError extends LottoNumberError {
    static MESSAGE = 'value는 Number 타입이여야합니다.';

    constructor() {
        super(ValueNotNumberError.MESSAGE);
    }
}

export class ValueNotIntegerError extends LottoNumberError {
    static MESSAGE = 'value는 정수 형태이어야합니다.';

    constructor() {
        super(ValueNotIntegerError.MESSAGE);
    }
}

export class ValueOutOfRangeError extends LottoNumberError {
    static MESSAGE = `value는 [1, 45] 사이의 정수 형태이어야합니다.`;

    constructor() {
        super(ValueOutOfRangeError.MESSAGE);
    }
}
