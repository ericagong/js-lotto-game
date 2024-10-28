import { hasDuplicated } from '../../../utils/utils.js';
import {
    NumbersNotArrayError,
    NumbersLengthNotSixError,
    NumbersDuplicatedError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

const sortNumbersAscending = (targets) => {
    return targets.sort((a, b) => Number(a) - Number(b));
};

export default class Lotto {
    #numbers;

    static DIGITS = 6;

    static of(numbers) {
        return new Lotto(numbers);
    }

    static #hasSixDigits(target) {
        return target.length !== Lotto.DIGITS;
    }

    static #validate(numbers) {
        if (!Array.isArray(numbers)) throw new NumbersNotArrayError();
        if (Lotto.#hasSixDigits(numbers)) throw new NumbersLengthNotSixError();
        if (hasDuplicated(numbers)) throw new NumbersDuplicatedError();
    }

    constructor(numbers) {
        Lotto.#validate(numbers);

        numbers = sortNumbersAscending(numbers);

        this.#numbers = numbers.map(LottoNumber.of);
    }

    getNumbers() {
        return this.#numbers.map((number) => number.value);
    }
}
