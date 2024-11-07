import { isNumber } from '../../../utils/utils.js';
import {
    ValueNotNumberError,
    ValueNotIntegerError,
    ValueOutOfRangeError,
} from './errors.js';

export default class LottoNumber {
    #value;

    static LOWER_BOUND = 1;
    static UPPER_BOUND = 45;

    static #LOTTO_NUMBERS = Array.from(
        { length: LottoNumber.UPPER_BOUND - LottoNumber.LOWER_BOUND + 1 },
        (_, index) => new LottoNumber(index + 1),
    );

    static of(value) {
        return LottoNumber.#LOTTO_NUMBERS[value - 1];
    }

    static #isInRange(target) {
        return (
            LottoNumber.LOWER_BOUND <= target &&
            target <= LottoNumber.UPPER_BOUND
        );
    }

    static #validate(value) {
        if (!isNumber(value)) throw new ValueNotNumberError();
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
