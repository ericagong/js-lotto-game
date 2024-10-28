import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';
import {
    // NotInitializedIndexError,
    IndexNotNumberError,
    PrizeNotNumberError,
    IsBonusMatchNotBooleanError,
    MatchCountNotNumberError,
} from '../../../src/js/domain/models/entities/Rank/errors.js';

describe('new Rank(index, matchCount, isBonusMatch, prize) 테스트', () => {
    describe('Rank 유효성 검사 테스트', () => {
        describe('index, matchCount, isBonusMatch, prize가 유효하지 않은 타입이라면, 에러를 발생시킨다.', () => {
            describe('index가 Number 타입이 아닌 경우', () => {
                it.each([
                    '1',
                    'erica',
                    true,
                    null,
                    undefined,
                    function () {},
                    {},
                    [],
                ])('index: %p', (rank) => {
                    expect(() => new Rank(rank)).toThrow(IndexNotNumberError);
                });
            });

            describe('matchCount가 Number 타입이 아닌 경우', () => {
                it.each([
                    '1',
                    'erica',
                    true,
                    null,
                    undefined,
                    function () {},
                    {},
                    [],
                ])('matchCount: %p', (matchCount) => {
                    expect(
                        () => new Rank(1, matchCount, false, 20_000_000_000),
                    ).toThrow(MatchCountNotNumberError);
                });
            });

            describe('isBonusMatch가 Boolean 타입이 아닌 경우', () => {
                it.each([
                    '1',
                    'erica',
                    1,
                    null,
                    undefined,
                    function () {},
                    {},
                    [],
                ])('isBonusMatch: %p', (isBonusMatch) => {
                    expect(
                        () => new Rank(1, 6, isBonusMatch, 20_000_000_000),
                    ).toThrow(IsBonusMatchNotBooleanError);
                });
            });

            describe('prize가 Number 타입이 아닌 경우', () => {
                it.each([
                    '1',
                    'erica',
                    true,
                    null,
                    undefined,
                    function () {},
                    {},
                    [],
                ])('prize: %p', (prize) => {
                    expect(() => new Rank(1, 6, false, prize)).toThrow(
                        PrizeNotNumberError,
                    );
                });
            });
        });

        it('모든 인자의 데이터 타입이 유효한 경우, 에러를 발생시키지 않는다.', () => {
            expect(() => new Rank(1, 6, false, 20_000_000_000)).not.toThrow();
        });
    });
});

describe('get index 테스트', () => {
    describe('index를 반환한다.', () => {
        it.each([
            {
                rank: Rank.FIRST,
                expected: 1,
            },
            { rank: Rank.SECOND, expected: 2 },
            { rank: Rank.THIRD, expected: 3 },
            { rank: Rank.FOURTH, expected: 4 },
            { rank: Rank.FIFTH, expected: 5 },
            { rank: Rank.NONE, expected: 6 },
        ])('index: $expected', ({ rank, expected }) => {
            expect(rank.index).toBe(expected);
        });
    });
});

describe('get macthCount 테스트', () => {
    describe('matchCount를 반환한다.', () => {
        it.each([
            {
                rank: Rank.FIRST,
                expected: 6,
            },
            { rank: Rank.SECOND, expected: 5 },
            { rank: Rank.THIRD, expected: 5 },
            { rank: Rank.FOURTH, expected: 4 },
            { rank: Rank.FIFTH, expected: 3 },
            { rank: Rank.NONE, expected: 2 },
        ])('matchCount: $expected', ({ rank, expected }) => {
            expect(rank.matchCount).toBe(expected);
        });
    });
});

describe('get isBonusMatch 테스트', () => {
    describe('isBonusMatch를 반환한다.', () => {
        it.each([
            {
                rank: Rank.FIRST,
                expected: false,
            },
            { rank: Rank.SECOND, expected: true },
            { rank: Rank.THIRD, expected: false },
            { rank: Rank.FOURTH, expected: false },
            { rank: Rank.FIFTH, expected: false },
            { rank: Rank.NONE, expected: false },
        ])('isBonusMatch: $expected', ({ rank, expected }) => {
            expect(rank.isBonusMatch).toBe(expected);
        });
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
