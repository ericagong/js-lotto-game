import {
    isArray,
    hasDuplicated,
    sortNumbersAscending,
} from '../../utils/utils.js';
import {
    LottoNumbersNotArrayError,
    LottoNumbersLengthNotSixError,
    LottoNumbersDuplicatedError,
} from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

export default class Lotto {
    #lottoNumbers;

    static DIGITS = 6;

    static of(numbers) {
        return new Lotto(numbers);
    }

    static #hasDigit(target) {
        return target.length !== Lotto.DIGITS;
    }

    static #validate(numbers) {
        if (!isArray(numbers)) throw new LottoNumbersNotArrayError();
        if (Lotto.#hasDigit(numbers)) throw new LottoNumbersLengthNotSixError();
        if (hasDuplicated(numbers)) throw new LottoNumbersDuplicatedError();
    }

    constructor(numbers) {
        Lotto.#validate(numbers);

        numbers = sortNumbersAscending(numbers);

        this.#lottoNumbers = numbers.map(LottoNumber.of);
    }

    getLottoNumbers() {
        return this.#lottoNumbers.map((lottoNumber) => lottoNumber.number);
    }
}
