import ValidationError from '../../../ValidationError.js';

class WinningLottoError extends ValidationError {
    static ERROR_TYPE = ' [WinningLotto Error] ';

    constructor(message) {
        super(WinningLottoError.ERROR_TYPE + message);
    }
}

export class LottoNotLottoInstanceError extends WinningLottoError {
    static MESSAGE = 'lotto가 Lotto 인스턴스 타입이 아닙니다.';

    constructor() {
        super(LottoNotLottoInstanceError.MESSAGE);
    }
}

export class BonusNumberDuplicatedError extends WinningLottoError {
    static MESSAGE =
        'bonusNumber는 lotto의 로또 번호들과 중복되지 않아야합니다.';

    constructor() {
        super(BonusNumberDuplicatedError.MESSAGE);
    }
}
