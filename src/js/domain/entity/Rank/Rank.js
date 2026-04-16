export default class Rank {
    constructor() {
        if (new.target === Rank) {
            throw new Error('Rank는 직접 인스턴스화할 수 없습니다.');
        }
    }

    get matchCount() {
        throw new Error('서브클래스에서 오버라이드해야 합니다.');
    }

    get isBonusMatch() {
        throw new Error('서브클래스에서 오버라이드해야 합니다.');
    }

    get prize() {
        throw new Error('서브클래스에서 오버라이드해야 합니다.');
    }

    get hasBonusCondition() {
        return false;
    }

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

class FirstRank extends Rank {
    get matchCount() {
        return 6;
    }
    get prize() {
        return 2_000_000_000;
    }
}

class SecondRank extends Rank {
    get matchCount() {
        return 5;
    }
    get isBonusMatch() {
        return true;
    }
    get hasBonusCondition() {
        return true;
    }
    get prize() {
        return 30_000_000;
    }
}

class ThirdRank extends Rank {
    get matchCount() {
        return 5;
    }
    get prize() {
        return 1_500_000;
    }
}

class FourthRank extends Rank {
    get matchCount() {
        return 4;
    }
    get prize() {
        return 50_000;
    }
}

class FifthRank extends Rank {
    get matchCount() {
        return 3;
    }
    get prize() {
        return 5_000;
    }
}

Rank.FIRST = new FirstRank();
Rank.SECOND = new SecondRank();
Rank.THIRD = new ThirdRank();
Rank.FOURTH = new FourthRank();
Rank.FIFTH = new FifthRank();

Rank.PRIZE_RANKS = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH];
