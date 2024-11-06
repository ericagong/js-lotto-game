import Calculator from '../../../src/js/domain/models/service/Calculator/index.js';
import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';

const { calculateRevenueRate, toPercentage } = Calculator;

describe('calculateRevenueRate(ranks) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [Rank.FIRST]',
                    ranks: [Rank.FIRST],
                    expected: 2_000_000_000 / 1_000,
                },
                {
                    name: 'ranks: [Rank.SECOND]',
                    ranks: [Rank.SECOND],
                    expected: 30_000_000 / 1_000,
                },
                {
                    name: 'ranks: [Rank.THIRD]',
                    ranks: [Rank.THIRD],
                    expected: 1_500_000 / 1_000,
                },
                {
                    name: 'ranks: [Rank.FOURTH]',
                    ranks: [Rank.FOURTH],
                    expected: 50_000 / 1_000,
                },
                {
                    name: 'ranks: [Rank.FIFTH]',
                    ranks: [Rank.FIFTH],
                    expected: 5_000 / 1_000,
                },
                {
                    name: 'ranks: [Rank.NONE]',
                    ranks: [Rank.NONE],
                    expected: 0 / 1_000,
                },
            ])('$name', ({ ranks, expected }) => {
                expect(calculateRevenueRate(ranks)).toBe(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it.each([
                {
                    name: 'ranks: [Rank.FIRST, Rank.SECOND, Rank.THIRD, Rank.FOURTH, Rank.FIFTH, Rank.NONE]',
                    ranks: [
                        Rank.FIRST,
                        Rank.SECOND,
                        Rank.THIRD,
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                    ],
                    expected: 338592.5,
                },
                {
                    name: 'ranks: [Rank.FIRST, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
                    ranks: [
                        Rank.FIRST,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 333334.1666666667,
                },
                {
                    name: 'ranks: [Rank.SECOND, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
                    ranks: [
                        Rank.SECOND,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 5000.833333333333,
                },
                {
                    name: 'ranks: [Rank.THIRD, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
                    ranks: [
                        Rank.THIRD,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 250.83333333333334,
                },
                {
                    name: 'ranks: [Rank.FOURTH, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
                    ranks: [
                        Rank.FOURTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 9.166666666666666,
                },
                {
                    name: 'ranks: [Rank.FIFTH, Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
                    ranks: [
                        Rank.FIFTH,
                        Rank.FIFTH,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                        Rank.NONE,
                    ],
                    expected: 1.6666666666666667,
                },
                {
                    name: 'ranks: [Rank.FIFTH, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE, Rank.NONE]',
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
                    expected: 0.625,
                },
            ])('$name', ({ ranks, expected }) => {
                expect(calculateRevenueRate(ranks)).toBe(expected);
            });
        });
    });
});

describe('toPercentage(rate) 테스트', () => {
    describe('rate를 퍼센트로 변환한 백분율을 반환한다.', () => {
        describe('백분율 값이 정수인 경우, 그대로 반환한다.', () => {
            it.each([
                { rate: 0, expected: 0 },
                { rate: 0.1, expected: 10 },
                { rate: 0.01, expected: 1 },
                { rate: 0.001, expected: 0.1 },
                { rate: 0.0001, expected: 0.01 },
            ])('rate: $rate', ({ rate, expected }) => {
                expect(toPercentage(rate)).toBe(expected);
            });
        });

        describe('백분율 값에 소수점이 있는 경우, 소수점 둘째 자리에서 반올림 하며, 맨 끝에 0은 있으면 제거한다.', () => {
            it.each([
                { rate: 0.0011, expected: 0.11 },
                { rate: 0.0019, expected: 0.19 },
                { rate: 0.00001, expected: 0 },
                { rate: 0.00009, expected: 0.01 },
                { rate: 0.00099, expected: 0.1 },
            ])('rate: $rate', ({ rate, expected }) => {
                expect(toPercentage(rate)).toBe(expected);
            });
        });
    });
});
