import Lotto from '../../entity/Lotto/Lotto.js';
import Ranks from '../Ranks/Ranks.js';

export default class Lottos {
    #lottos;

    static of(numbersList) {
        const lottos = numbersList.map((numbers) => Lotto.of(numbers));
        return new Lottos(lottos);
    }

    static from(lottos) {
        return new Lottos([...lottos]);
    }

    constructor(lottos) {
        this.#lottos = lottos;
    }

    get count() {
        return this.#lottos.length;
    }

    get snapshot() {
        return this.#lottos.map((lotto) => lotto.getNumbers());
    }

    determineRanks(winningLotto) {
        const ranks = this.#lottos.map((lotto) => winningLotto.getRank(lotto));
        return Ranks.from(ranks);
    }
}
