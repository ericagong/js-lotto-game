import { hasDuplicated } from '../../utils.js';
import {
    NumbersNotArrayError,
    NumbersLengthNotSixError,
    NumbersDuplicatedError,
    TargetNotLottoNumberInstanceError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

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

    static #sortAscending(numbers) {
        return [...numbers].sort((a, b) => a - b);
    }

    constructor(numbers) {
        Lotto.#validate(numbers);

        this.#numbers = Lotto.#sortAscending(numbers).map(LottoNumber.of);
    }

    contains(target) {
        if (!(target instanceof LottoNumber)) throw new TargetNotLottoNumberInstanceError();
        const targetNumber = target.value;
        return this.#numbers.some((number) => number.value === targetNumber);
    }

    getNumbers() {
        return this.#numbers.map((number) => number.value);
    }
}
