import ValidationError from '../../../ValidationError.js';

class WinningLottoError extends ValidationError {
    static ERROR_TYPE = ' [WinningLotto Error] ';

    constructor(message) {
        super(WinningLottoError.ERROR_TYPE + message);
    }
}

export class NotLottoInstanceError extends WinningLottoError {
    static MESSAGE = 'lotto가 Lotto 인스턴스 형태가 아닙니다.';

    constructor() {
        super(NotLottoInstanceError.MESSAGE);
    }
}

export class DuplicatedError extends WinningLottoError {
    static MESSAGE = 'bonusNumber는 당첨 로또 번호들과 중복되지 않아야합니다.';

    constructor() {
        super(DuplicatedError.MESSAGE);
    }
}
