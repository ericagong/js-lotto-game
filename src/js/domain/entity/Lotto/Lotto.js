import { isDuplicated } from '../../../utils.js';
import {
    NumbersNotArrayError,
    NumbersInvalidLengthError,
    NumbersDuplicatedError,
    NotLottoNumberInstanceError,
    NotLottoInstanceError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

export default class Lotto {
    #numbers;

    static DIGITS = 6;
    static UNIT_PRICE = 1_000;

    static #isValidLength(value) {
        return value.length === Lotto.DIGITS;
    }

    static #validate(numbers) {
        if (!Array.isArray(numbers)) throw new NumbersNotArrayError();
        if (!Lotto.#isValidLength(numbers)) throw new NumbersInvalidLengthError(Lotto.DIGITS);
        if (isDuplicated(numbers)) throw new NumbersDuplicatedError();
    }

    static #sortAscending(numbers) {
        return [...numbers].sort((a, b) => a - b);
    }

    constructor(numbers) {
        Lotto.#validate(numbers);
        this.#numbers = Lotto.#sortAscending(numbers).map(LottoNumber.of);
    }

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

    hasNumber(lottoNumber) {
        if (!(lottoNumber instanceof LottoNumber)) throw new NotLottoNumberInstanceError();
        return this.#numbers.includes(lottoNumber);
    }

    getMatchCount(other) {
        if (!(other instanceof Lotto)) throw new NotLottoInstanceError();
        const otherSet = new Set(other.#numbers);
        return this.#numbers.filter((n) => otherSet.has(n)).length;
    }

    get numbers() {
        return this.#numbers.map((number) => number.value);
    }
}
