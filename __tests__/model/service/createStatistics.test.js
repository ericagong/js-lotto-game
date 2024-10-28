import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';
import {
    countRanks,
    calculateRevenuePercentage,
} from '../../../src/js/domain/models/service/createStatistics.js';

describe('countRanks(ranks) 테스트', () => {
    describe('rank 개수를 [1등, 2등, 3등, 4등, 5등, 없음] 배열 형태로 세어 반환한다.', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                {
                    rankIndex: 1,
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                        [Rank.NONE, 0],
                    ]),
                },
                {
                    rankIndex: 2,
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                        [Rank.NONE, 0],
                    ]),
                },
                {
                    rankIndex: 3,
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                        [Rank.NONE, 0],
                    ]),
                },
                {
                    rankIndex: 4,
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 0],
                        [Rank.NONE, 0],
                    ]),
                },
                {
                    rankIndex: 5,
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 0],
                    ]),
                },
                {
                    rankIndex: 6,
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                        [Rank.NONE, 1],
                    ]),
                },
            ])('rankIndex: $rankIndex', ({ rankIndex, expected }) => {
                const ranks = [Rank.of(rankIndex)];
                expect(countRanks(ranks)).toEqual(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            const testCases = [
                {
                    rankIndexes: [1, 2, 3, 4, 5, 6],
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 1],
                    ]),
                },
                {
                    rankIndexes: [1, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                },
                {
                    rankIndexes: [2, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                },
                {
                    rankIndexes: [3, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                },
                {
                    rankIndexes: [4, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                },
                {
                    rankIndexes: [5, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 2],
                        [Rank.NONE, 4],
                    ]),
                },
                {
                    rankIndexes: [5, 6, 6, 6, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 7],
                    ]),
                },
            ];

            it.each(testCases)(
                'rankIndexes: $rankIndexes',
                ({ rankIndexes, expected }) => {
                    const ranks = rankIndexes.map((rank) => Rank.of(rank));
                    expect(countRanks(ranks)).toEqual(expected);
                },
            );
        });
    });
});

describe('calculateRevenuePercentage(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            const testCases = [
                {
                    rankIndex: 1,
                    expected: (2_000_000_000 / 1_000) * 100,
                },
                {
                    rankIndex: 2,
                    expected: (30_000_000 / 1_000) * 100,
                },
                {
                    rankIndex: 3,
                    expected: (1_500_000 / 1_000) * 100,
                },
                {
                    rankIndex: 4,
                    expected: (50_000 / 1_000) * 100,
                },
                {
                    rankIndex: 5,
                    expected: (5_000 / 1_000) * 100,
                },
                {
                    rankIndex: 6,
                    expected: (0 / 1_000) * 100,
                },
            ];

            it.each(testCases)(
                'rankIndex: $rankIndex',
                ({ rankIndex, expected }) => {
                    const ranks = [Rank.of(rankIndex)];
                    expect(calculateRevenuePercentage(ranks)).toBe(expected);
                },
            );
        });

        describe('로또가 여러 개인 경우', () => {
            const testCases = [
                { rankIndexes: [1, 2, 3, 4, 5, 6], expected: 33859250 },
                { rankIndexes: [1, 5, 6, 6, 6, 6], expected: 33333416.67 },
                { rankIndexes: [2, 5, 6, 6, 6, 6], expected: 500083.33 },
                { rankIndexes: [3, 5, 6, 6, 6, 6], expected: 25083.33 },
                { rankIndexes: [4, 5, 6, 6, 6, 6], expected: 916.67 },
                { rankIndexes: [5, 5, 6, 6, 6, 6], expected: 166.67 },
                { rankIndexes: [5, 6, 6, 6, 6, 6, 6, 6], expected: 62.5 },
            ];

            it.each(testCases)(
                'rankIndexes: $rankIndexes',
                ({ rankIndexes, expected }) => {
                    const ranks = rankIndexes.map((rank) => Rank.of(rank));
                    expect(calculateRevenuePercentage(ranks)).toBe(expected);
                },
            );
        });
    });
});
