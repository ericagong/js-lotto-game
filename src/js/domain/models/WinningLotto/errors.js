import ValidationError from '../../ValidationError.js';

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

export class BonusNumberDuplicatedError extends WinningLottoError {
    static MESSAGE = '보너스 번호는 당첨 로또 번호들과 중복되지 않아야합니다.';

    constructor() {
        super(BonusNumberDuplicatedError.MESSAGE);
    }
}

// export class NotBonusNumberInstanceError extends WinningLottoError {
//     static MESSAGE = 'bonusNumber가 BonusNumber 인스턴스 형태가 아닙니다.';

//     constructor() {
//         super(NotBonusNumberInstanceError.MESSAGE);
//     }
// }
