import {
    LottoNumberNotNumberError,
    LottoNumberNotIntegerError,
    LottoNumberOutOfRangeError,
} from './errors';

export default class LottoNumber {
    #number;

    static LOWER_BOUND = 1;
    static UPPER_BOUND = 45;

    static of(number) {
        return new LottoNumber(number);
    }

    constructor(number) {
        this.#validate(number);
        this.#number = number;
    }

    #isNumber(target) {
        return typeof target === 'number';
    }

    #isInteger(target) {
        return Number.isInteger(target);
    }

    #isInRange(target) {
        return (
            LottoNumber.LOWER_BOUND <= target &&
            target <= LottoNumber.UPPER_BOUND
        );
    }

    #validate(number) {
        if (!this.#isNumber(number)) throw new LottoNumberNotNumberError();
        if (!this.#isInteger(number)) throw new LottoNumberNotIntegerError();
        if (!this.#isInRange(number)) throw new LottoNumberOutOfRangeError();
    }

    getNumber() {
        return this.#number;
    }
}
