import DomainError from '../../DomainError.js';

class LottosError extends DomainError {
    static #TYPE = '[LottosError]';

    constructor(message) {
        super(`${LottosError.#TYPE} ${message}`);
    }
}

export class LottosNotArrayError extends LottosError {
    static #MESSAGE = 'lottos는 배열 형태여야 합니다.';

    constructor() {
        super(LottosNotArrayError.#MESSAGE);
    }
}

export class ElementNotLottoInstanceError extends LottosError {
    static #MESSAGE = 'lottos의 모든 원소는 Lotto 인스턴스여야 합니다.';

    constructor() {
        super(ElementNotLottoInstanceError.#MESSAGE);
    }
}
