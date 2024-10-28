import ValidationError from '../../../ValidationError.js';

export class LottoError extends ValidationError {
    static ERROR_TYPE = ' [Lotto Error] ';

    constructor(message) {
        super(LottoError.ERROR_TYPE + message);
    }
}

export class NotArrayError extends LottoError {
    static MESSAGE = 'lottoNumbers는 배열 형태여야합니다.';

    constructor() {
        super(NotArrayError.MESSAGE);
    }
}

// [ ] 순환 참조 문제 해결
export class LengthNotSixError extends LottoError {
    static MESSAGE = 'lottoNumbers는 길이가 6인 배열 형태여야합니다.';

    constructor() {
        super(LengthNotSixError.MESSAGE);
    }
}

export class DuplicatedError extends LottoError {
    static MESSAGE = 'lottoNumbers는 모두 중복되지 않아야합니다.';

    constructor() {
        super(DuplicatedError.MESSAGE);
    }
}
