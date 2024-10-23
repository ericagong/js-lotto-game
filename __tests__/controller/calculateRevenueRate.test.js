import calculateRevenueRate from '../../src/js/controller/calculateRevenueRate.js';
import Rank from '../../src/js/domain/models/Rank/Rank.js';

describe('calculateRevenueRate(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        Rank.initializeRanks();
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
                    expect(calculateRevenueRate(ranks)).toBe(
                        expected.toString(),
                    );
                },
            );
        });

        describe('로또가 여러 개인 경우', () => {
            const testCases = [
                { rankIndexes: [1, 2, 3, 4, 5, 6], expected: 33859250 },
                { rankIndexes: [1, 5, 6, 6, 6, 6], expected: 33333416.67 },
                { rankIndexes: [2, 5, 6, 6, 6, 6], expected: 500083.3 },
                { rankIndexes: [3, 5, 6, 6, 6, 6], expected: 25083.3 },
                { rankIndexes: [4, 5, 6, 6, 6, 6], expected: 916.67 },
                { rankIndexes: [5, 5, 6, 6, 6, 6], expected: 166.67 },
                { rankIndexes: [5, 6, 6, 6, 6, 6, 6, 6], expected: 62.5 },
            ];

            it.each(testCases)(
                'rankIndexes: $rankIndexes',
                ({ rankIndexes, expected }) => {
                    const ranks = rankIndexes.map((rank) => Rank.of(rank));
                    expect(calculateRevenueRate(ranks)).toBe(
                        expected.toString(),
                    );
                },
            );
        });
    });
});
