import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';
import { getRankCounter } from '../../../src/js/domain/models/service/Statistic/getRankCounter.js';
import { getRevenuePercentage } from '../../../src/js/domain/models/service/Statistic/getRevenuePercentage.js';

describe('getRankCounter(ranks) 테스트', () => {
    describe('rank 개수를 [1등, 2등, 3등, 4등, 5등] 배열 형태로 세어 반환한다.', () => {
        describe('로또가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [1]',
                    ranks: [Rank.FIRST],
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                    ]),
                },
                {
                    name: 'ranks: [2]',
                    ranks: [Rank.SECOND],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                    ]),
                },
                {
                    name: 'ranks: [3]',
                    ranks: [Rank.THIRD],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                    ]),
                },
                {
                    name: 'ranks: [4]',
                    ranks: [Rank.FOURTH],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 0],
                    ]),
                },
                {
                    name: 'ranks: [5]',
                    ranks: [Rank.FIFTH],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [6]',
                    ranks: [Rank.NONE],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 0],
                    ]),
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getRankCounter(ranks)).toEqual(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [1, 2, 3, 4, 5, 6]',
                    ranks: [
                        Rank.FIRST,
                        Rank.SECOND,
                        Rank.THIRD,
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [1, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FIRST,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [2, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.SECOND,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [3, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.THIRD,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [4, 5, 6, 6, 6]',
                    ranks: [
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                    ]),
                },
                {
                    name: 'ranks: [5, 5, 6, 6, 6]',
                    ranks: [
                        Rank.FIFTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 2],
                    ]),
                },
                {
                    name: 'ranks: [5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: new Map([
                        [Rank.FIRST, 0],
                        [Rank.SECOND, 0],
                        [Rank.THIRD, 0],
                        [Rank.FOURTH, 0],
                        [Rank.FIFTH, 1],
                    ]),
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getRankCounter(ranks)).toEqual(expected);
            });
        });
    });
});

describe('getRevenuePercentage(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [1]',
                    ranks: [Rank.FIRST],
                    expected: (2_000_000_000 / 1_000) * 100,
                },
                {
                    name: 'ranks: [2]',
                    ranks: [Rank.SECOND],
                    expected: (30_000_000 / 1_000) * 100,
                },
                {
                    name: 'ranks: [3]',
                    ranks: [Rank.THIRD],
                    expected: (1_500_000 / 1_000) * 100,
                },
                {
                    name: 'ranks: [4]',
                    ranks: [Rank.FOURTH],
                    expected: (50_000 / 1_000) * 100,
                },
                {
                    name: 'ranks: [5]',
                    ranks: [Rank.FIFTH],
                    expected: (5_000 / 1_000) * 100,
                },
                {
                    name: 'ranks: [6]',
                    ranks: [Rank.NONE],
                    expected: (0 / 1_000) * 100,
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getRevenuePercentage(ranks)).toBe(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [1, 2, 3, 4, 5, 6]',
                    ranks: [
                        Rank.FIRST,
                        Rank.SECOND,
                        Rank.THIRD,
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                    ],
                    expected: 33_859_250,
                },
                {
                    name: 'ranks: [1, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FIRST,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 33_333_416.67,
                },
                {
                    name: 'ranks: [2, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.SECOND,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 500_083.33,
                },
                {
                    name: 'ranks: [3, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.THIRD,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 25_083.33,
                },
                {
                    name: 'ranks: [4, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 916.67,
                },
                {
                    name: 'ranks: [5, 5, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FIFTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 166.67,
                },
                {
                    name: 'ranks: [5, 6, 6, 6, 6, 6, 6, 6]',
                    ranks: [
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 62.5,
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getRevenuePercentage(ranks)).toBe(expected);
            });
        });
    });
});
