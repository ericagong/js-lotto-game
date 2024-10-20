import ValidationError from '../../ValidationError.js';

export class BonusNumberError extends ValidationError {
    static ERROR_TYPE = ' [BonusNumber Error] ';

    constructor(message) {
        super(BonusNumberError.ERROR_TYPE + message);
    }
}

export class NotLottoInstanceError extends BonusNumberError {
    static MESSAGE = '로또는 로또 객체의 인스턴스여야 합니다.';

    constructor() {
        super(NotLottoInstanceError.MESSAGE);
    }
}

export class BonusNumberDuplicatedError extends BonusNumberError {
    static MESSAGE = '보너스 번호는 당첨 로또 번호들과 중복되지 않아야합니다.';

    constructor() {
        super(BonusNumberDuplicatedError.MESSAGE);
    }
}
