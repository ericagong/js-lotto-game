import Statistics from '../src/js/Statistics';
import Rank from '../src/js/Rank';

const statistics = new Statistics();

describe('count() 테스트', () => {
    describe('올바른 rankCounts 배열을 반환한다.', () => {
        describe('당첨 로또 개수가 1개인 경우', () => {
            const testCases = [
                {
                    rank: 1,
                    rankCounts: [1, 0, 0, 0, 0, 0],
                },
                {
                    rank: 2,
                    rankCounts: [0, 1, 0, 0, 0, 0],
                },
                {
                    rank: 3,
                    rankCounts: [0, 0, 1, 0, 0, 0],
                },
                {
                    rank: 4,
                    rankCounts: [0, 0, 0, 1, 0, 0],
                },
                {
                    rank: 5,
                    rankCounts: [0, 0, 0, 0, 1, 0],
                },
                {
                    rank: 6,
                    rankCounts: [0, 0, 0, 0, 0, 1],
                },
            ];

            it.each(testCases)('rank: $rank', ({ rank, rankCounts }) => {
                const ranks = [Rank.of(rank)];
                expect(statistics.count(ranks)).toEqual(rankCounts);
            });
        });
    });
});

describe('calculateRevenue() 테스트', () => {
    describe('올바른 수익률을 반환한다.', () => {
        describe('당첨 로또 개수가 1개인 경우', () => {
            const testCases = [
                {
                    rank: 1,
                    revenueRate: (2_000_000_000 / 1_000) * 100,
                },
                {
                    rank: 2,
                    revenueRate: (30_000_000 / 1_000) * 100,
                },
                {
                    rank: 3,
                    revenueRate: (1_500_000 / 1_000) * 100,
                },
                {
                    rank: 4,
                    revenueRate: (50_000 / 1_000) * 100,
                },
                {
                    rank: 5,
                    revenueRate: (5_000 / 1_000) * 100,
                },
                {
                    rank: 6,
                    revenueRate: (0 / 1_000) * 100,
                },
            ];

            it.each(testCases)('rank: $rank', ({ rank, revenueRate }) => {
                const ranks = [Rank.of(rank)];
                expect(statistics.calculate(ranks)).toBe(revenueRate);
            });
        });
    });
});
