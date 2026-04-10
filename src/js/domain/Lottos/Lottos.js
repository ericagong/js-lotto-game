import Lotto from '../Lotto/Lotto.js';
import generateLottoNumbers from './generateLottoNumbers.js';

export default class Lottos {
    #lottos;

    static of(numbersList) {
        const lottos = numbersList.map((numbers) => Lotto.of(numbers));
        return new Lottos(lottos);
    }

    static from(lottos) {
        return new Lottos([...lottos]);
    }

    static issue(budget) {
        const lottos = Array.from({ length: budget.maxIssueCount }, () => Lotto.of(generateLottoNumbers()));
        return new Lottos(lottos);
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
        return this.#lottos.map((lotto) => winningLotto.getRank(lotto));
    }
}
