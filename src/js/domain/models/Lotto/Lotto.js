import LottoNumber from '../LottoNumber/LottoNumber.js';
import {
    LottoNumbersNotArrayError,
    LottoNumbersLengthNotSixError,
    LottoNumbersDuplicatedError,
} from './errors.js';
import { LOTTO_DIGITS } from '../../constants.js';

export default class Lotto {
    #lottoNumbers;

    static of(numbers) {
        return new Lotto(numbers);
    }

    constructor(numbers) {
        this.#validate(numbers);

        numbers = this.#sortNumbersAscending(numbers);

        this.#lottoNumbers = numbers.map(LottoNumber.of);
    }

    #validate(numbers) {
        if (!this.#isArray(numbers)) throw new LottoNumbersNotArrayError();
        if (numbers.length !== LOTTO_DIGITS)
            throw new LottoNumbersLengthNotSixError();
        if (this.#isDuplicated(numbers))
            throw new LottoNumbersDuplicatedError();
    }

    #isArray(numbers) {
        return Array.isArray(numbers);
    }

    #isDuplicated(numbers) {
        return new Set(numbers).size !== numbers.length;
    }

    #sortNumbersAscending(numbers) {
        return numbers.sort((a, b) => Number(a) - Number(b));
    }

    getLottoNumbers() {
        return this.#lottoNumbers.map((lottoNumber) => lottoNumber.getNumber());
    }
}
