import { isNumber, isInteger } from '../../utils/utils.js';
import {
    LottoNumberNotNumberError,
    LottoNumberNotIntegerError,
    LottoNumberOutOfRangeError,
} from './errors.js';

export default class LottoNumber {
    #number;

    static LOWER_BOUND = 1;
    static UPPER_BOUND = 45;

    static of(number) {
        return new LottoNumber(number);
    }

    static #isInRange(target) {
        return (
            LottoNumber.LOWER_BOUND <= target &&
            target <= LottoNumber.UPPER_BOUND
        );
    }

    static #validate(number) {
        if (!isNumber(number)) throw new LottoNumberNotNumberError();
        if (!isInteger(number)) throw new LottoNumberNotIntegerError();
        if (!LottoNumber.#isInRange(number))
            throw new LottoNumberOutOfRangeError();
    }

    constructor(number) {
        LottoNumber.#validate(number);
        this.#number = number;
    }

    get number() {
        return this.#number;
    }
}
