import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';
import {
    PrizeNotNumberError,
    IsBonusMatchNotBooleanError,
    MatchCountNotNumberError,
} from '../../../src/js/domain/models/entities/Rank/errors.js';

describe('static from(matchCount, isBonusMatch) 테스트', () => {
    describe('matchCount와 isBonusMatch 기반으로 Rank 인스턴스를 반환한다.', () => {
        it.each([
            {
                matchCount: 6,
                isBonusMatch: false,
                expected: Rank.FIRST,
            },
            {
                matchCount: 5,
                isBonusMatch: true,
                expected: Rank.SECOND,
            },
            {
                matchCount: 5,
                isBonusMatch: false,
                expected: Rank.THIRD,
            },
            {
                matchCount: 4,
                isBonusMatch: false,
                expected: Rank.FOURTH,
            },
            {
                matchCount: 3,
                isBonusMatch: false,
                expected: Rank.FIFTH,
            },
            {
                matchCount: 2,
                isBonusMatch: false,
                expected: Rank.NONE,
            },
        ])(
            'matchCount: $matchCount, isBonusMatch: $isBonusMatch',
            ({ matchCount, isBonusMatch, expected }) => {
                expect(Rank.from(matchCount, isBonusMatch)).toBe(expected);
            },
        );
    });
});

describe('new Rank(matchCount, isBonusMatch, prize) 테스트', () => {
    describe('Rank 유효성 검사 테스트', () => {
        describe('matchCount, isBonusMatch, prize가 유효하지 않은 타입이라면, 에러를 발생시킨다.', () => {
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
                        () => new Rank(matchCount, false, 20_000_000_000),
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
                        () => new Rank(6, isBonusMatch, 20_000_000_000),
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
                    expect(() => new Rank(6, false, prize)).toThrow(
                        PrizeNotNumberError,
                    );
                });
            });
        });

        it('모든 인자의 데이터 타입이 유효한 경우, 에러를 발생시키지 않는다.', () => {
            expect(() => new Rank(6, false, 20_000_000_000)).not.toThrow();
        });
    });
});

describe('get matchCount 테스트', () => {
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
