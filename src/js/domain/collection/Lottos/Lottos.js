import Lotto from '../../entity/Lotto/Lotto.js';
import Ranks from '../Ranks/Ranks.js';
import { LottosNotArrayError, ElementNotLottoInstanceError } from './errors.js';

export default class Lottos {
    #lottos;

    static #validate(lottos) {
        if (!Array.isArray(lottos)) throw new LottosNotArrayError();
        if (!lottos.every((lotto) => Lotto.isLotto(lotto))) throw new ElementNotLottoInstanceError();
    }

    constructor(lottos) {
        Lottos.#validate(lottos);
        this.#lottos = lottos;
    }

    static of(numbersList) {
        const lottos = numbersList.map((numbers) => Lotto.of(numbers));
        return new Lottos(lottos);
    }

    static from(lottos) {
        return new Lottos([...lottos]);
    }

    get count() {
        return this.#lottos.length;
    }

    toNumbersList() {
        return this.#lottos.map((lotto) => lotto.toValues());
    }

    determineRanks(winningLotto) {
        const ranks = this.#lottos.map((lotto) => winningLotto.getRank(lotto)).filter((rank) => rank !== null);
        return Ranks.from(ranks);
    }
}
