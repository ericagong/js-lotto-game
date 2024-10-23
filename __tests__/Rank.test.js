import Rank, { determineRank } from '../src/js/domain/models/Rank/Rank.js';
import {
    NotInitializedIndexError,
    IndexNotNumberError,
    PrizeNotNumberError,
    isBonusMatchNotBooleanError,
    MatchCountNotNumberError,
} from '../src/js/domain/models/Rank/errors.js';

// [ ] Question - static initializeRanks 테스트 불가 - 어떻게 테스트 코드 작성해야할지?
describe('static of() 테스트', () => {
    describe('rank index가 1, 2, 3, 4, 5, 6 중 하나라면, 미리 생성된 Rank 객체를 반환한다.', () => {
        it.each([
            {
                index: 1,
                prize: 2_000_000_000,
                isBonusMatch: false,
                matchCount: 6,
            },
            { index: 2, prize: 30_000_000, isBonusMatch: true, matchCount: 5 },
            { index: 3, prize: 1_500_000, isBonusMatch: false, matchCount: 5 },
            { index: 4, prize: 50_000, isBonusMatch: false, matchCount: 4 },
            { index: 5, prize: 5_000, isBonusMatch: false, matchCount: 3 },
            { index: 6, prize: 0, isBonusMatch: false, matchCount: 2 },
        ])('index: $index', ({ index, prize, isBonusMatch, matchCount }) => {
            const expectedRank = new Rank(
                index,
                prize,
                isBonusMatch,
                matchCount,
            );
            expect(Rank.of(index)).toEqual(expectedRank);
        });
    });

    describe('rank index가 사전에 정의된 값이 아니면, 에러를 생성한다.', () => {
        it.each([
            0,
            7,
            '1',
            'erica',
            true,
            null,
            undefined,
            function () {},
            {},
            [],
        ])('index: %p', (index) => {
            expect(() => Rank.of(index)).toThrow(NotInitializedIndexError);
        });
    });
});

describe('Rank 생성자 테스트', () => {
    describe('Rank 유효성 검사 테스트', () => {
        describe('index가 number 타입이 아니면, 에러를 발생시킨다.', () => {
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

        describe('prize가 number 타입이 아니면, 에러를 발생시킨다.', () => {
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
                expect(() => new Rank(1, prize)).toThrow(PrizeNotNumberError);
            });
        });

        describe('isBonusMatch가 boolean 타입이 아니면, 에러를 발생시킨다.', () => {
            it.each(['1', 'erica', 1, null, undefined, function () {}, {}, []])(
                'isBonusMatch: %p',
                (isBonusMatch) => {
                    expect(
                        () => new Rank(1, 20_000_000_000, isBonusMatch),
                    ).toThrow(isBonusMatchNotBooleanError);
                },
            );
        });

        describe('matchCount가 number 타입이 아니면, 에러를 발생시킨다.', () => {
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
                    () => new Rank(1, 20_000_000_000, false, matchCount),
                ).toThrow(MatchCountNotNumberError);
            });
        });

        it('모든 인자의 데이터 타입이 유효한 경우, 에러를 발생시키지 않는다.', () => {
            expect(() => new Rank(1, 20_000_000_000, false, 6)).not.toThrow();
        });
    });
});

describe('getter 테스트', () => {
    Rank.initializeRanks();

    describe('get index 테스트', () => {
        describe('index를 반환한다.', () => {
            it.each([
                {
                    idx: 1,
                    expected: 1,
                },
                { idx: 6, expected: 6 },
            ])('index: $idx', ({ idx, expected }) => {
                expect(Rank.of(idx).index).toBe(expected);
            });
        });
    });

    describe('get prize 테스트', () => {
        describe('prize를 반환한다.', () => {
            it.each([
                {
                    index: 1,
                    expected: 2_000_000_000,
                },
                { index: 6, expected: 0 },
            ])('index: $index', ({ index, expected }) => {
                expect(Rank.of(index).prize).toBe(expected);
            });
        });
    });

    describe('get macthCount 테스트', () => {
        describe('matchCount를 반환한다.', () => {
            it.each([
                {
                    index: 1,
                    expected: 6,
                },
                { index: 2, expected: 5 },
                { index: 3, expected: 5 },
                { index: 4, expected: 4 },
                { index: 5, expected: 3 },
                { index: 6, expected: 2 },
            ])('index: $index', ({ index, expected }) => {
                expect(Rank.of(index).matchCount).toBe(expected);
            });
        });
    });

    describe('get isBonusMatch 테스트', () => {
        describe('isBonusMatch를 반환한다.', () => {
            it.each([
                {
                    index: 1,
                    expected: false,
                },
                { index: 2, expected: true },
                { index: 3, expected: false },
                { index: 4, expected: false },
                { index: 5, expected: false },
                { index: 6, expected: false },
            ])('index: $index', ({ index, expected }) => {
                expect(Rank.of(index).isBonusMatch).toBe(expected);
            });
        });
    });
});

describe('determineRank(matchCount, isBonusMatch) 테스트', () => {
    describe('matchCount와 isBonusMatch에 따라, Rank를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, rankIndex: 1 },
            { matchCount: 5, isBonusMatch: true, rankIndex: 2 },
            { matchCount: 5, isBonusMatch: false, rankIndex: 3 },
            { matchCount: 4, isBonusMatch: false, rankIndex: 4 },
            { matchCount: 3, isBonusMatch: false, rankIndex: 5 },
        ])(
            'matchCount: %matchCount, isBonusMatch: %isBonusMatch, rankIndex: $rankIndex',
            ({ matchCount, isBonusMatch, rankIndex }) => {
                const rank = determineRank(matchCount, isBonusMatch);
                expect(rank.index).toBe(rankIndex);
            },
        );
    });
});
