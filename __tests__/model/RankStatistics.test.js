import RankStatistics from '../../src/js/domain/RankStatistics/RankStatistics.js';
import Rank from '../../src/js/domain/Rank/Rank.js';

const LOTTO_UNIT_PRICE = 1_000;
const totalCostFor = (lottoCount) => lottoCount * LOTTO_UNIT_PRICE;

describe('RankStatistics.from(ranks, totalCost).summary 테스트', () => {
    describe('당첨 등수(1~5등)별 개수를 [1등, 2등, 3등, 4등, 5등] 순서의 배열로 반환한다.', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [FIRST]',
                    ranks: [Rank.FIRST],
                    expected: [
                        { matchCount: 6, isBonusMatch: false, prize: 2_000_000_000, count: 1 },
                        { matchCount: 5, isBonusMatch: true, prize: 30_000_000, count: 0 },
                        { matchCount: 5, isBonusMatch: false, prize: 1_500_000, count: 0 },
                        { matchCount: 4, isBonusMatch: false, prize: 50_000, count: 0 },
                        { matchCount: 3, isBonusMatch: false, prize: 5_000, count: 0 },
                    ],
                },
                {
                    name: 'ranks: [SECOND]',
                    ranks: [Rank.SECOND],
                    expected: [
                        { matchCount: 6, isBonusMatch: false, prize: 2_000_000_000, count: 0 },
                        { matchCount: 5, isBonusMatch: true, prize: 30_000_000, count: 1 },
                        { matchCount: 5, isBonusMatch: false, prize: 1_500_000, count: 0 },
                        { matchCount: 4, isBonusMatch: false, prize: 50_000, count: 0 },
                        { matchCount: 3, isBonusMatch: false, prize: 5_000, count: 0 },
                    ],
                },
                {
                    name: 'ranks: [NONE]',
                    ranks: [Rank.NONE],
                    expected: [
                        { matchCount: 6, isBonusMatch: false, prize: 2_000_000_000, count: 0 },
                        { matchCount: 5, isBonusMatch: true, prize: 30_000_000, count: 0 },
                        { matchCount: 5, isBonusMatch: false, prize: 1_500_000, count: 0 },
                        { matchCount: 4, isBonusMatch: false, prize: 50_000, count: 0 },
                        { matchCount: 3, isBonusMatch: false, prize: 5_000, count: 0 },
                    ],
                },
            ])('$name', ({ ranks, expected }) => {
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.summary).toEqual(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it('ranks: [FIRST, SECOND, THIRD, FOURTH, FIFTH, NONE]', () => {
                const ranks = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH, Rank.NONE];
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.summary).toEqual([
                    { matchCount: 6, isBonusMatch: false, prize: 2_000_000_000, count: 1 },
                    { matchCount: 5, isBonusMatch: true, prize: 30_000_000, count: 1 },
                    { matchCount: 5, isBonusMatch: false, prize: 1_500_000, count: 1 },
                    { matchCount: 4, isBonusMatch: false, prize: 50_000, count: 1 },
                    { matchCount: 3, isBonusMatch: false, prize: 5_000, count: 1 },
                ]);
            });

            it('ranks: [FIRST, FIFTH, NONE, NONE, NONE, NONE] — NONE은 카운트되지 않는다', () => {
                const ranks = [Rank.FIRST, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE];
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.summary).toEqual([
                    { matchCount: 6, isBonusMatch: false, prize: 2_000_000_000, count: 1 },
                    { matchCount: 5, isBonusMatch: true, prize: 30_000_000, count: 0 },
                    { matchCount: 5, isBonusMatch: false, prize: 1_500_000, count: 0 },
                    { matchCount: 4, isBonusMatch: false, prize: 50_000, count: 0 },
                    { matchCount: 3, isBonusMatch: false, prize: 5_000, count: 1 },
                ]);
            });
        });
    });
});

describe('RankStatistics.from(ranks, totalCost).revenueRate 테스트', () => {
    describe('총 당첨금을 총 구매 금액으로 나눈 ratio를 반환한다 (예: 1.05 = 105%).', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                { name: 'ranks: [FIRST]', ranks: [Rank.FIRST], expected: 2_000_000 },
                { name: 'ranks: [SECOND]', ranks: [Rank.SECOND], expected: 30_000 },
                { name: 'ranks: [THIRD]', ranks: [Rank.THIRD], expected: 1_500 },
                { name: 'ranks: [FOURTH]', ranks: [Rank.FOURTH], expected: 50 },
                { name: 'ranks: [FIFTH]', ranks: [Rank.FIFTH], expected: 5 },
                { name: 'ranks: [NONE]', ranks: [Rank.NONE], expected: 0 },
            ])('$name', ({ ranks, expected }) => {
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.revenueRate).toBe(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it('ranks: [FIRST, SECOND, THIRD, FOURTH, FIFTH, NONE]', () => {
                const ranks = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH, Rank.NONE];
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.revenueRate).toBe(338_592.5);
            });

            it('ranks: [FIRST, FIFTH, NONE x4]', () => {
                const ranks = [Rank.FIRST, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE];
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.revenueRate).toBeCloseTo(333_334.1667, 4);
            });

            it('ranks: [FIFTH, NONE x7]', () => {
                const ranks = [
                    Rank.FIFTH,
                    Rank.NONE,
                    Rank.NONE,
                    Rank.NONE,
                    Rank.NONE,
                    Rank.NONE,
                    Rank.NONE,
                    Rank.NONE,
                ];
                const stats = RankStatistics.from(ranks, totalCostFor(ranks.length));
                expect(stats.revenueRate).toBe(0.625);
            });
        });
    });
});
