import DomainError from '../../DomainError.js';

class WinningLottoError extends DomainError {
    static #TYPE = '[WinningLottoError]';

    constructor(message) {
        super(`${WinningLottoError.#TYPE} ${message}`);
    }
}

export class LottoNotLottoInstanceError extends WinningLottoError {
    static #MESSAGE = 'lotto는 Lotto 인스턴스여야 합니다.';

    constructor() {
        super(LottoNotLottoInstanceError.#MESSAGE);
    }
}

export class BonusNumberNotLottoNumberInstanceError extends WinningLottoError {
    static #MESSAGE = 'bonusNumber는 LottoNumber 인스턴스여야 합니다.';

    constructor() {
        super(BonusNumberNotLottoNumberInstanceError.#MESSAGE);
    }
}

export class BonusNumberDuplicatedError extends WinningLottoError {
    static #MESSAGE = 'bonusNumber는 lotto의 번호와 중복되지 않아야 합니다.';

    constructor() {
        super(BonusNumberDuplicatedError.#MESSAGE);
    }
}
