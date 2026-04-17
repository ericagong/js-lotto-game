import Statistics from '../../src/js/domain/service/Statistics/Statistics.js';
import Rank from '../../src/js/domain/entity/Rank/Rank.js';
import Ranks from '../../src/js/domain/collection/Ranks/Ranks.js';
import { RanksNotRanksInstanceError, TotalCostNotPositiveNumberError } from '../../src/js/domain/service/Statistics/errors.js';

const LOTTO_UNIT_PRICE = 1_000;
const totalCostFor = (lottoCount) => lottoCount * LOTTO_UNIT_PRICE;
const ranksFrom = (rankList) => Ranks.from(rankList);

describe('new RankStatistics(ranks, totalCost) 유효성 검사 테스트', () => {
    describe('ranks가 Ranks 인스턴스가 아닌 경우, 에러를 발생시킨다.', () => {
        it.each([null, undefined, '1', 1, {}, [], [Rank.FIRST]])('ranks: %p', (ranks) => {
            expect(() => Statistics.of(ranks, 1_000)).toThrow(RanksNotRanksInstanceError);
        });
    });

    describe('totalCost가 양수 Number가 아닌 경우, 에러를 발생시킨다.', () => {
        it.each([0, -1, '1000', null, undefined, {}])('totalCost: %p', (totalCost) => {
            expect(() => Statistics.of(ranksFrom([]), totalCost)).toThrow(
                TotalCostNotPositiveNumberError,
            );
        });
    });

    it('유효한 인자라면, 에러를 발생시키지 않는다.', () => {
        expect(() => Statistics.of(ranksFrom([Rank.FIRST]), 2_000)).not.toThrow();
    });
});

describe('Statistics.of(ranks, totalCost).summarize() 테스트', () => {
    describe('당첨 등수(1~5등)별 개수를 [1등, 2등, 3등, 4등, 5등] 순서의 배열로 반환한다.', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [FIRST]',
                    ranks: [Rank.FIRST],
                    expected: [
                        { rank: Rank.FIRST, count: 1 },
                        { rank: Rank.SECOND, count: 0 },
                        { rank: Rank.THIRD, count: 0 },
                        { rank: Rank.FOURTH, count: 0 },
                        { rank: Rank.FIFTH, count: 0 },
                    ],
                },
                {
                    name: 'ranks: [SECOND]',
                    ranks: [Rank.SECOND],
                    expected: [
                        { rank: Rank.FIRST, count: 0 },
                        { rank: Rank.SECOND, count: 1 },
                        { rank: Rank.THIRD, count: 0 },
                        { rank: Rank.FOURTH, count: 0 },
                        { rank: Rank.FIFTH, count: 0 },
                    ],
                },
                {
                    name: 'ranks: [] (꽝만 있었을 때)',
                    ranks: [],
                    expected: [
                        { rank: Rank.FIRST, count: 0 },
                        { rank: Rank.SECOND, count: 0 },
                        { rank: Rank.THIRD, count: 0 },
                        { rank: Rank.FOURTH, count: 0 },
                        { rank: Rank.FIFTH, count: 0 },
                    ],
                },
            ])('$name', ({ ranks, expected }) => {
                const lottoCount = Math.max(ranks.length, 1);
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(lottoCount));
                expect(stats.summarize()).toEqual(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it('ranks: [FIRST, SECOND, THIRD, FOURTH, FIFTH]', () => {
                const ranks = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH];
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(6));
                expect(stats.summarize()).toEqual([
                    { rank: Rank.FIRST, count: 1 },
                    { rank: Rank.SECOND, count: 1 },
                    { rank: Rank.THIRD, count: 1 },
                    { rank: Rank.FOURTH, count: 1 },
                    { rank: Rank.FIFTH, count: 1 },
                ]);
            });

            it('ranks: [FIRST, FIFTH] — 꽝은 필터링되어 Ranks에 포함되지 않는다', () => {
                const ranks = [Rank.FIRST, Rank.FIFTH];
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(6));
                expect(stats.summarize()).toEqual([
                    { rank: Rank.FIRST, count: 1 },
                    { rank: Rank.SECOND, count: 0 },
                    { rank: Rank.THIRD, count: 0 },
                    { rank: Rank.FOURTH, count: 0 },
                    { rank: Rank.FIFTH, count: 1 },
                ]);
            });
        });
    });
});

describe('Statistics.of(ranks, totalCost).calculateRevenueRate() 테스트', () => {
    describe('총 당첨금을 총 구매 금액으로 나눈 ratio를 반환한다 (예: 1.05 = 105%).', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                { name: 'ranks: [FIRST]', ranks: [Rank.FIRST], expected: 2_000_000 },
                { name: 'ranks: [SECOND]', ranks: [Rank.SECOND], expected: 30_000 },
                { name: 'ranks: [THIRD]', ranks: [Rank.THIRD], expected: 1_500 },
                { name: 'ranks: [FOURTH]', ranks: [Rank.FOURTH], expected: 50 },
                { name: 'ranks: [FIFTH]', ranks: [Rank.FIFTH], expected: 5 },
                { name: 'ranks: [] (꽝)', ranks: [], expected: 0 },
            ])('$name', ({ ranks, expected }) => {
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(1));
                expect(stats.calculateRevenueRate()).toBe(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it('ranks: [FIRST, SECOND, THIRD, FOURTH, FIFTH] (6장 구매)', () => {
                const ranks = [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH];
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(6));
                expect(stats.calculateRevenueRate()).toBe(338_592.5);
            });

            it('ranks: [FIRST, FIFTH] (6장 구매)', () => {
                const ranks = [Rank.FIRST, Rank.FIFTH];
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(6));
                expect(stats.calculateRevenueRate()).toBeCloseTo(333_334.1667, 4);
            });

            it('ranks: [FIFTH] (8장 구매)', () => {
                const ranks = [Rank.FIFTH];
                const stats = Statistics.of(ranksFrom(ranks), totalCostFor(8));
                expect(stats.calculateRevenueRate()).toBe(0.625);
            });
        });
    });
});
