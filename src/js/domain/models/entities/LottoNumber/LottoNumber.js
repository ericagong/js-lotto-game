import {
    ValueNotNumberError,
    ValueNotIntegerError,
    ValueOutOfRangeError,
} from './errors.js';

export default class LottoNumber {
    #value;

    static LOWER_BOUND = 1;
    static UPPER_BOUND = 45;

    static of(value) {
        return new LottoNumber(value);
    }

    static #isInRange(target) {
        return (
            LottoNumber.LOWER_BOUND <= target &&
            target <= LottoNumber.UPPER_BOUND
        );
    }

    static #validate(value) {
        if (typeof value !== 'number') throw new ValueNotNumberError();
        if (!Number.isInteger(value)) throw new ValueNotIntegerError();
        if (!LottoNumber.#isInRange(value)) throw new ValueOutOfRangeError();
    }

    constructor(value) {
        LottoNumber.#validate(value);
        this.#value = value;
    }

    get value() {
        return this.#value;
    }
}
