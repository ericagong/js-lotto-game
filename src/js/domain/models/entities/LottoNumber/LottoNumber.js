import { isNumber, isInteger } from '../../../utils/utils.js';
import { NotNumberError, NotIntegerError, OutOfRangeError } from './errors.js';

// [ ]  45개 만들어 두고 시작해도 됨
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
        if (!isNumber(number)) throw new NotNumberError();
        if (!isInteger(number)) throw new NotIntegerError();
        if (!LottoNumber.#isInRange(number)) throw new OutOfRangeError();
    }

    constructor(number) {
        LottoNumber.#validate(number);
        this.#number = number;
    }

    get number() {
        return this.#number;
    }
}
