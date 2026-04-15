import Rank from '../../src/js/domain/entity/Rank/Rank.js';
import { PrizeNotNumberError } from '../../src/js/domain/entity/Rank/errors.js';

describe('static from(matchCount, isBonusMatch) 테스트', () => {
    describe('matchCount와 isBonusMatch 기반으로 Rank 인스턴스를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, expected: Rank.FIRST },
            { matchCount: 6, isBonusMatch: true, expected: Rank.FIRST },
            { matchCount: 5, isBonusMatch: true, expected: Rank.SECOND },
            { matchCount: 5, isBonusMatch: false, expected: Rank.THIRD },
            { matchCount: 4, isBonusMatch: false, expected: Rank.FOURTH },
            { matchCount: 3, isBonusMatch: false, expected: Rank.FIFTH },
            { matchCount: 2, isBonusMatch: false, expected: Rank.NONE },
            { matchCount: 1, isBonusMatch: false, expected: Rank.NONE },
            { matchCount: 0, isBonusMatch: false, expected: Rank.NONE },
        ])('matchCount: $matchCount, isBonusMatch: $isBonusMatch', ({ matchCount, isBonusMatch, expected }) => {
            expect(Rank.from(matchCount, isBonusMatch)).toBe(expected);
        });
    });
});

describe('new Rank(prize) 유효성 검사 테스트', () => {
    describe('prize가 Number 타입이 아닌 경우, 에러를 발생시킨다.', () => {
        it.each(['1', 'erica', true, null, undefined, function () {}, {}, []])('prize: %p', (prize) => {
            expect(() => new Rank(prize)).toThrow(PrizeNotNumberError);
        });
    });

    it('prize가 Number 타입이면, 에러를 발생시키지 않는다.', () => {
        expect(() => new Rank(0)).not.toThrow();
    });
});

describe('get prize 테스트', () => {
    describe('prize를 반환한다.', () => {
        it.each([
            { rank: Rank.FIRST, expected: 2_000_000_000 },
            { rank: Rank.SECOND, expected: 30_000_000 },
            { rank: Rank.THIRD, expected: 1_500_000 },
            { rank: Rank.FOURTH, expected: 50_000 },
            { rank: Rank.FIFTH, expected: 5_000 },
            { rank: Rank.NONE, expected: 0 },
        ])('prize: $expected', ({ rank, expected }) => {
            expect(rank.prize).toBe(expected);
        });
    });
});
