import Ranks from '../../../src/js/domain/models/service/Ranks/index.js';
import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';

const { getRankStatistic, getRevenueRate } = Ranks;

describe('getRankStatistic(ranks) 테스트', () => {
    describe('rank 별 개수를 [1등, 2등, 3등, 4등, 5등] 순서로 센 Map 객체를 반환한다.', () => {
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
                expect(getRankStatistic(ranks)).toEqual(expected);
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
            ])('$name', ({ ranks, expected }) => {
                expect(getRankStatistic(ranks)).toEqual(expected);
            });
        });
    });
});

describe('getRevenueRate(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눈 수익률을 백분율로 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [1]',
                    ranks: [Rank.FIRST],
                    expected: 200000000,
                },
                {
                    name: 'ranks: [2]',
                    ranks: [Rank.SECOND],
                    expected: 3000000,
                },
                {
                    name: 'ranks: [3]',
                    ranks: [Rank.THIRD],
                    expected: 150000,
                },
                {
                    name: 'ranks: [4]',
                    ranks: [Rank.FOURTH],
                    expected: 5000,
                },
                {
                    name: 'ranks: [5]',
                    ranks: [Rank.FIFTH],
                    expected: 500,
                },
                {
                    name: 'ranks: [6]',
                    ranks: [Rank.NONE],
                    expected: 0,
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getRevenueRate(ranks)).toBe(expected);
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
                    expected: 33859250,
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
                    expected: 33333416.67,
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
                    expected: 500083.33,
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
                    expected: 25083.33,
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
                expect(getRevenueRate(ranks)).toBe(expected);
            });
        });
    });
});
