import { isNumber } from '../../utils/utils.js';
import { RankNotNumberError, RankOutOfRangeError } from './errors.js';

export const RANKS = Object.freeze({
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    NONE: 6,
});

const PRIZES = Object.freeze({
    [RANKS.FIRST]: 2_000_000_000,
    [RANKS.SECOND]: 30_000_000,
    [RANKS.THIRD]: 1_500_000,
    [RANKS.FOURTH]: 50_000,
    [RANKS.FIFTH]: 5_000,
    [RANKS.NONE]: 0,
});

// TODO matchCount, isBonusMatch 정보까지 저장
// TODO Rank는 총 5개 미리 만들어두기 (Map)
// Rank 이름 바꾸기
export default class Rank {
    #rank;
    #prize;
    #matchCount;
    #isBonusMatch;

    static of(rank) {
        return new Rank(rank);
    }

    static #isInRange(rank) {
        return rank >= RANKS.FIRST && rank <= RANKS.NONE;
    }

    static #validate(rank) {
        if (!isNumber(rank)) throw new RankNotNumberError();
        if (!Rank.#isInRange(rank)) throw new RankOutOfRangeError();
    }

    constructor(rank) {
        Rank.#validate(rank);

        this.#rank = rank;
        this.#prize = PRIZES[rank];
    }

    get rank() {
        return this.#rank;
    }

    get prize() {
        return this.#prize;
    }
}

export const determineRank = (matchCount, isBonusMatch) => {
    if (matchCount === 6) return Rank.of(RANKS.FIRST);
    if (matchCount === 5 && isBonusMatch) return Rank.of(RANKS.SECOND);
    if (matchCount === 5) return Rank.of(RANKS.THIRD);
    if (matchCount === 4) return Rank.of(RANKS.FOURTH);
    if (matchCount === 3) return Rank.of(RANKS.FIFTH);
    return Rank.of(RANKS.NONE); // 매칭이 3개 미만일 때 NONE 반환
};
