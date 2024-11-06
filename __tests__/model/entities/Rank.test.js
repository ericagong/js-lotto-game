import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';
import {
    GetMatchCountError,
    GetIsBonusMatchError,
} from '../../../src/js/domain/models/entities/Rank/errors.js';

describe('static from() 테스트', () => {
    describe('matchCount, isBonusMatch 조건에 따라 Rank를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, expected: Rank.FIRST },
            { matchCount: 5, isBonusMatch: true, expected: Rank.SECOND },
            { matchCount: 5, isBonusMatch: false, expected: Rank.THIRD },
            { matchCount: 4, isBonusMatch: true, expected: Rank.FOURTH },
            { matchCount: 4, isBonusMatch: false, expected: Rank.FOURTH },
            { matchCount: 3, isBonusMatch: true, expected: Rank.FIFTH },
            { matchCount: 3, isBonusMatch: false, expected: Rank.FIFTH },
            { matchCount: 2, isBonusMatch: true, expected: Rank.NONE },
            { matchCount: 2, isBonusMatch: false, expected: Rank.NONE },
            { matchCount: 1, isBonusMatch: true, expected: Rank.NONE },
            { matchCount: 1, isBonusMatch: false, expected: Rank.NONE },
            { matchCount: 0, isBonusMatch: true, expected: Rank.NONE },
            { matchCount: 0, isBonusMatch: false, expected: Rank.NONE },
        ])(
            'matchCount: $matchCount, isBonusMatch: $isBonusMatch',
            ({ matchCount, isBonusMatch, expected }) => {
                expect(Rank.from(matchCount, isBonusMatch)).toBe(expected);
            },
        );
    });
});

describe('new Rank() 테스트', () => {
    it('new 키워드로 Rank 객체를 생성하려고 하면, 에러가 발생한다.', () => {
        expect(() => new Rank()).toThrow(TypeError);
    });
});

describe('getMatchCount() 테스트', () => {
    describe('Rank별로 matchCount를 반환한다.', () => {
        it.each([
            {
                rank: Rank.FIRST,
                expected: 6,
            },
            { rank: Rank.SECOND, expected: 5 },
            { rank: Rank.THIRD, expected: 5 },
            { rank: Rank.FOURTH, expected: 4 },
            { rank: Rank.FIFTH, expected: 3 },
        ])('matchCount: $expected', ({ rank, expected }) => {
            expect(rank.getMatchCount()).toBe(expected);
        });
    });

    it('Rank.NONE인 경우, 에러를 발생시킨다.', () => {
        expect(() => Rank.NONE.getMatchCount()).toThrow(GetMatchCountError);
    });
});

describe('getIsBonusMatch() 테스트', () => {
    it('Rank.SECOND인 경우, true를 반환한다.', () => {
        expect(Rank.SECOND.getIsBonusMatch()).toBe(true);
    });

    it('Rank.THIRD인 경우, false를 반환한다.', () => {
        expect(Rank.THIRD.getIsBonusMatch()).toBe(false);
    });

    describe('Rank.SECOND, Rank.THIRD가 아닌 경우, 에러를 발생시킨다.', () => {
        it.each([Rank.FIRST, Rank.FOURTH, Rank.FIFTH, Rank.NONE])(
            'rank: %p',
            (rank) => {
                expect(() => rank.getIsBonusMatch()).toThrow(
                    GetIsBonusMatchError,
                );
            },
        );
    });
});

describe('get prize 테스트', () => {
    describe('prize를 반환한다.', () => {
        it.each([
            {
                rank: Rank.FIRST,
                expected: 2_000_000_000,
            },
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
