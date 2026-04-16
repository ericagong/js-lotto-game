export default class Rank {
    #prize;
    #matchCount;
    #isBonusMatch;

    constructor(prize, matchCount, isBonusMatch) {
        this.#prize = prize;
        this.#matchCount = matchCount;
        this.#isBonusMatch = isBonusMatch;
    }

    get prize() {
        return this.#prize;
    }

    get matchCount() {
        return this.#matchCount;
    }

    get isBonusMatch() {
        return this.#isBonusMatch;
    }

    static FIRST = new Rank(2_000_000_000, 6);
    static SECOND = new Rank(30_000_000, 5, true);
    static THIRD = new Rank(1_500_000, 5, false);
    static FOURTH = new Rank(50_000, 4);
    static FIFTH = new Rank(5_000, 3);

    static PRIZE_RANKS = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH];

    static from(matchCount, isBonusMatch) {
        switch (matchCount) {
            case 6:
                return Rank.FIRST;
            case 5:
                return isBonusMatch ? Rank.SECOND : Rank.THIRD;
            case 4:
                return Rank.FOURTH;
            case 3:
                return Rank.FIFTH;
            default:
                return null;
        }
    }
}
