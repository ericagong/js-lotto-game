import Rank from '../../src/js/domain/entity/Rank/Rank.js';

describe('Rank 추상 클래스 테스트', () => {
    it('직접 인스턴스화하면 에러를 발생시킨다.', () => {
        expect(() => new Rank()).toThrow('Rank는 직접 인스턴스화할 수 없습니다.');
    });
});

describe('static from(matchCount, isBonusMatch) 테스트', () => {
    describe('matchCount와 isBonusMatch 기반으로 Rank 인스턴스를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, expected: Rank.FIRST },
            { matchCount: 6, isBonusMatch: true, expected: Rank.FIRST },
            { matchCount: 5, isBonusMatch: true, expected: Rank.SECOND },
            { matchCount: 5, isBonusMatch: false, expected: Rank.THIRD },
            { matchCount: 4, isBonusMatch: false, expected: Rank.FOURTH },
            { matchCount: 3, isBonusMatch: false, expected: Rank.FIFTH },
        ])('matchCount: $matchCount, isBonusMatch: $isBonusMatch', ({ matchCount, isBonusMatch, expected }) => {
            expect(Rank.from(matchCount, isBonusMatch)).toBe(expected);
        });
    });

    describe('매칭 3개 미만이면 null을 반환한다.', () => {
        it.each([
            { matchCount: 2, isBonusMatch: false },
            { matchCount: 1, isBonusMatch: false },
            { matchCount: 0, isBonusMatch: false },
        ])('matchCount: $matchCount', ({ matchCount, isBonusMatch }) => {
            expect(Rank.from(matchCount, isBonusMatch)).toBeNull();
        });
    });
});

describe('서브클래스 속성 테스트', () => {
    describe('prize를 반환한다.', () => {
        it.each([
            { rank: Rank.FIRST, expected: 2_000_000_000 },
            { rank: Rank.SECOND, expected: 30_000_000 },
            { rank: Rank.THIRD, expected: 1_500_000 },
            { rank: Rank.FOURTH, expected: 50_000 },
            { rank: Rank.FIFTH, expected: 5_000 },
        ])('prize: $expected', ({ rank, expected }) => {
            expect(rank.prize).toBe(expected);
        });
    });

    describe('matchCount를 반환한다.', () => {
        it.each([
            { rank: Rank.FIRST, expected: 6 },
            { rank: Rank.SECOND, expected: 5 },
            { rank: Rank.THIRD, expected: 5 },
            { rank: Rank.FOURTH, expected: 4 },
            { rank: Rank.FIFTH, expected: 3 },
        ])('matchCount: $expected', ({ rank, expected }) => {
            expect(rank.matchCount).toBe(expected);
        });
    });

    describe('hasBonusCondition을 반환한다.', () => {
        it.each([
            { rank: Rank.FIRST, expected: false },
            { rank: Rank.SECOND, expected: true },
            { rank: Rank.THIRD, expected: false },
            { rank: Rank.FOURTH, expected: false },
            { rank: Rank.FIFTH, expected: false },
        ])('hasBonusCondition: $expected', ({ rank, expected }) => {
            expect(rank.hasBonusCondition).toBe(expected);
        });
    });

    it('SecondRank만 isBonusMatch를 가진다.', () => {
        expect(Rank.SECOND.isBonusMatch).toBe(true);
    });

    it('isBonusMatch가 없는 Rank에서 접근하면 에러를 발생시킨다.', () => {
        expect(() => Rank.FIRST.isBonusMatch).toThrow();
        expect(() => Rank.THIRD.isBonusMatch).toThrow();
        expect(() => Rank.FOURTH.isBonusMatch).toThrow();
        expect(() => Rank.FIFTH.isBonusMatch).toThrow();
    });
});

describe('PRIZE_RANKS 테스트', () => {
    it('5개의 등수를 포함한다.', () => {
        expect(Rank.PRIZE_RANKS).toHaveLength(5);
        expect(Rank.PRIZE_RANKS).toEqual([Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH]);
    });
});
