import ValidationError from '../../../ValidationError.js';

class WinningLottoError extends ValidationError {
    static #TYPE = 'WinningLottoError';

    constructor(message) {
        super(WinningLottoError.#TYPE, message);
    }
}

export class LottoNotLottoInstanceError extends WinningLottoError {
    static #MESSAGE = 'lotto가 Lotto 인스턴스 타입이 아닙니다.';

    constructor() {
        super(LottoNotLottoInstanceError.#MESSAGE);
    }
}

export class BonusNumberNotLottoNumberInstanceError extends WinningLottoError {
    static #MESSAGE = 'bonusNumber가 LottoNumber 인스턴스 타입이 아닙니다.';

    constructor() {
        super(BonusNumberNotLottoNumberInstanceError.#MESSAGE);
    }
}

export class BonusNumberDuplicatedError extends WinningLottoError {
    static #MESSAGE = 'bonusNumber가 lotto의 로또 번호와 중복됩니다.';

    constructor() {
        super(BonusNumberDuplicatedError.#MESSAGE);
    }
}
