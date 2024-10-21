import calculateRevenue from '../src/js/domain/models/Statistics/calculateRevenue.js';
import Rank from '../src/js/domain/models/Rank/Rank.js';

describe('calculateRevenue(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            const testCases = [
                {
                    rank: 1,
                    expected: (2_000_000_000 / 1_000) * 100,
                },
                {
                    rank: 2,
                    expected: (30_000_000 / 1_000) * 100,
                },
                {
                    rank: 3,
                    expected: (1_500_000 / 1_000) * 100,
                },
                {
                    rank: 4,
                    expected: (50_000 / 1_000) * 100,
                },
                {
                    rank: 5,
                    expected: (5_000 / 1_000) * 100,
                },
                {
                    rank: 6,
                    expected: (0 / 1_000) * 100,
                },
            ];

            it.each(testCases)('rank: $rank', ({ rank, expected }) => {
                const ranks = [Rank.of(rank)];
                expect(calculateRevenue(ranks)).toBe(expected.toString());
            });
        });

        describe('로또가 여러 개인 경우', () => {
            const testCases = [
                { ranks: [1, 2, 3, 4, 5, 6], expected: 33859250 },
                { ranks: [1, 5, 6, 6, 6, 6], expected: 33333416.67 },
                { ranks: [2, 5, 6, 6, 6, 6], expected: 500083.3 },
                { ranks: [3, 5, 6, 6, 6, 6], expected: 25083.3 },
                { ranks: [4, 5, 6, 6, 6, 6], expected: 916.67 },
                { ranks: [5, 5, 6, 6, 6, 6], expected: 166.67 },
                { ranks: [5, 6, 6, 6, 6, 6, 6, 6], expected: 62.5 },
            ];

            it.each(testCases)('ranks: $ranks', ({ ranks, expected }) => {
                const ranksArr = ranks.map((rank) => Rank.of(rank));
                expect(calculateRevenue(ranksArr)).toBe(expected.toString());
            });
        });
    });
});
