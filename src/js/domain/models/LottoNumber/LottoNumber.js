import { LOTTO_LOWER_BOUND, LOTTO_UPPER_BOUND } from '../../constants';
import {
    LottoNumberNotNumberError,
    LottoNumberNotIntegerError,
    LottoNumberOutOfRangeError,
} from './errors';

export default class LottoNumber {
    #number;

    static of(number) {
        return new LottoNumber(number);
    }

    constructor(number) {
        this.#validate(number);
        this.#number = number;
    }

    #isNumber(number) {
        return typeof number === 'number';
    }

    #isInteger(number) {
        return Number.isInteger(number);
    }

    #isInRange(number) {
        return LOTTO_LOWER_BOUND <= number && number <= LOTTO_UPPER_BOUND;
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
