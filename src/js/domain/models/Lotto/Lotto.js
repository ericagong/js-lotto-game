import LottoNumber from '../LottoNumber/LottoNumber.js';
import {
    LottoNumbersNotArrayError,
    LottoNumbersLengthNotSixError,
    LottoNumbersDuplicatedError,
} from './errors.js';

export default class Lotto {
    #lottoNumbers;

    static DIGITS = 6;

    static of(numbers) {
        return new Lotto(numbers);
    }

    constructor(numbers) {
        this.#validate(numbers);

        numbers = this.#sortNumbersAscending(numbers);

        this.#lottoNumbers = numbers.map(LottoNumber.of);
    }

    #validate(numbers) {
        if (this.#isNotArray(numbers)) throw new LottoNumbersNotArrayError();
        if (this.#isLottoDigitLength(numbers))
            throw new LottoNumbersLengthNotSixError();
        if (this.#hasDuplicated(numbers))
            throw new LottoNumbersDuplicatedError();
    }

    #isNotArray(target) {
        return !Array.isArray(target);
    }

    #isLottoDigitLength(target) {
        return target.length !== Lotto.DIGITS;
    }

    #hasDuplicated(target) {
        return new Set(target).size !== target.length;
    }

    #sortNumbersAscending(target) {
        return target.sort((a, b) => Number(a) - Number(b));
    }

    getLottoNumbers() {
        return this.#lottoNumbers.map((lottoNumber) => lottoNumber.getNumber());
    }
}
