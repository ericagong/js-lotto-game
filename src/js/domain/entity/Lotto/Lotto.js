import { hasDuplicated } from '../../../utils.js';
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

    static random() {
        const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const numbers = new Set();
        while (numbers.size < Lotto.DIGITS) {
            numbers.add(generateRandomNumber(LottoNumber.LOWER_BOUND, LottoNumber.UPPER_BOUND));
        }
        return new Lotto(Array.from(numbers));
    }

    static #isValidDigits(target) {
        return target.length !== Lotto.DIGITS;
    }

    static #validate(numbers) {
        if (!Array.isArray(numbers)) throw new NumbersNotArrayError();
        if (Lotto.#isValidDigits(numbers)) throw new NumbersLengthNotSixError();
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
        return this.#numbers.includes(target);
    }

    getNumbers() {
        return this.#numbers.map((number) => number.value);
    }
}
