import { isArray, hasDuplicated } from '../../../utils/utils.js';
import { NotArrayError, LengthNotSixError, DuplicatedError } from './errors.js';
import LottoNumber from '../LottoNumber/LottoNumber.js';

const sortNumbersAscending = (targets) => {
    return targets.sort((a, b) => Number(a) - Number(b));
};

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
        if (!isArray(numbers)) throw new NotArrayError();
        if (Lotto.#hasDigit(numbers)) throw new LengthNotSixError();
        if (hasDuplicated(numbers)) throw new DuplicatedError();
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
