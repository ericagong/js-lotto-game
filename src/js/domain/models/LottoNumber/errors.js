import ValidationError from '../../ValidationError.js';
import { LOTTO_LOWER_BOUND, LOTTO_UPPER_BOUND } from '../../constants';

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
    static MESSAGE = `로또 번호는 [${LOTTO_LOWER_BOUND}, ${LOTTO_UPPER_BOUND}] 사이의 숫자여야합니다.`;

    constructor() {
        super(LottoNumberOutOfRangeError.MESSAGE);
    }
}
