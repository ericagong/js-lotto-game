import Statistic from '../../../src/js/domain/models/service/Statistic/index.js';
import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';
import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../../../src/js/domain/models/entities/WinningLotto/WinningLotto.js';
import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';

const {
    getRank,
    getCounter,
    calculateRevenueRate,
    toPercentage,
    deleteNoneRank,
} = Statistic;

describe('getRank(targetLotto, winningLotto) 테스트', () => {
    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
    const bonusLottoNumber = LottoNumber.of(7);
    const winningLotto = WinningLotto.from(lotto, bonusLottoNumber);
    describe('targetLotto 번호와 winningLotto 번호([1, 2, 3, 4, 5, 6], 7)를 비교해, Rank 객체를 반환한다.', () => {
        it.each([
            {
                targetLottoNumbers: [1, 2, 3, 4, 5, 6],
                expected: Rank.FIRST,
            },
            {
                targetLottoNumbers: [1, 2, 3, 4, 5, 7],
                expected: Rank.SECOND,
            },
            { targetLottoNumbers: [1, 2, 3, 4, 5, 45], expected: Rank.THIRD },
            { targetLottoNumbers: [1, 2, 3, 4, 44, 45], expected: Rank.FOURTH },
            { targetLottoNumbers: [1, 2, 3, 43, 44, 45], expected: Rank.FIFTH },
            { targetLottoNumbers: [1, 2, 42, 43, 44, 45], expected: Rank.NONE },
            {
                targetLottoNumbers: [1, 41, 42, 43, 44, 45],
                expected: Rank.NONE,
            },
            {
                targetLottoNumbers: [40, 41, 42, 43, 44, 45],
                expected: Rank.NONE,
            },
        ])(
            'targetLottoNumbers: $targetLottoNumbers, ',
            ({ targetLottoNumbers, expected }) => {
                const targetLotto = Lotto.of(targetLottoNumbers);
                expect(getRank(targetLotto, winningLotto)).toEqual(expected);
            },
        );
    });
});

describe('getCounter(ranks) 테스트', () => {
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
                        [Rank.NONE, 0],
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
                        [Rank.NONE, 0],
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
                        [Rank.NONE, 0],
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
                        [Rank.NONE, 0],
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
                        [Rank.NONE, 0],
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
                        [Rank.NONE, 1],
                    ]),
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getCounter(ranks)).toEqual(expected);
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
                        [Rank.NONE, 1],
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
                        [Rank.NONE, 4],
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
                        [Rank.NONE, 4],
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
                        [Rank.NONE, 4],
                    ]),
                },
            ])('$name', ({ ranks, expected }) => {
                expect(getCounter(ranks)).toEqual(expected);
            });
        });
    });
});

describe('calculateRevenueRate(counter) 테스트', () => {
    describe('당첨된 lottos 금액을 구매 금액으로 나눠 수익률 계산해 반환한다.', () => {
        describe('로또 개수가 1개인 경우', () => {
            it.each([
                {
                    name: 'counter: [1]',
                    counter: new Map([[Rank.FIRST, 1]]),
                    expected: 2_000_000_000 / 1_000,
                },
                {
                    name: 'counter: [2]',
                    counter: new Map([[Rank.SECOND, 1]]),
                    expected: 30_000_000 / 1_000,
                },
                {
                    name: 'counter: [3]',
                    counter: new Map([[Rank.THIRD, 1]]),
                    expected: 1_500_000 / 1_000,
                },
                {
                    name: 'counter: [4]',
                    counter: new Map([[Rank.FOURTH, 1]]),
                    expected: 50_000 / 1_000,
                },
                {
                    name: 'counter: [5]',
                    counter: new Map([[Rank.FIFTH, 1]]),
                    expected: 5_000 / 1_000,
                },
                {
                    name: 'counter: [6]',
                    counter: new Map([[Rank.NONE, 1]]),
                    expected: 0 / 1_000,
                },
            ])('$name', ({ counter, expected }) => {
                expect(calculateRevenueRate(counter)).toBe(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            it.each([
                {
                    name: 'counter: [1, 2, 3, 4, 5, 6]',
                    counter: new Map([
                        [Rank.FIRST, 1],
                        [Rank.SECOND, 1],
                        [Rank.THIRD, 1],
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 1],
                    ]),
                    expected: 338592.5,
                },
                {
                    name: 'counter: [1, 5, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.FIRST, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                    expected: 333334.1666666667,
                },
                {
                    name: 'counter: [2, 5, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.SECOND, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                    expected: 5000.833333333333,
                },
                {
                    name: 'counter: [3, 5, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.THIRD, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                    expected: 250.83333333333334,
                },
                {
                    name: 'counter: [4, 5, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.FOURTH, 1],
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 4],
                    ]),
                    expected: 9.166666666666666,
                },
                {
                    name: 'counter: [5, 5, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.FIFTH, 2],
                        [Rank.NONE, 4],
                    ]),
                    expected: 1.6666666666666667,
                },
                {
                    name: 'counter: [5, 6, 6, 6, 6, 6, 6, 6]',
                    counter: new Map([
                        [Rank.FIFTH, 1],
                        [Rank.NONE, 7],
                    ]),
                    expected: 0.625,
                },
            ])('$name', ({ counter, expected }) => {
                expect(calculateRevenueRate(counter)).toBe(expected);
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

describe('deleteNoneRank(counter) 테스트', () => {
    describe('counter에서 NONE 랭크를 제거한 Map 객체를 반환한다.', () => {
        it.each([
            {
                name: 'counter: [6]',
                counter: new Map([[Rank.NONE, 1]]),
                expected: new Map(),
            },
            {
                name: 'counter: [1, 2, 3, 4, 5, 6]',
                counter: new Map([
                    [Rank.FIRST, 1],
                    [Rank.SECOND, 1],
                    [Rank.THIRD, 1],
                    [Rank.FOURTH, 1],
                    [Rank.FIFTH, 1],
                    [Rank.NONE, 1],
                ]),
                expected: new Map([
                    [Rank.FIRST, 1],
                    [Rank.SECOND, 1],
                    [Rank.THIRD, 1],
                    [Rank.FOURTH, 1],
                    [Rank.FIFTH, 1],
                ]),
            },
            {
                name: 'counter: [1, 5, 6, 6, 6, 6]',
                counter: new Map([
                    [Rank.FIRST, 1],
                    [Rank.FIFTH, 1],
                    [Rank.NONE, 4],
                ]),
                expected: new Map([
                    [Rank.FIRST, 1],
                    [Rank.FIFFTH, 1],
                ]),
            },
        ])('$name', ({ counter, expected }) => {
            expect(deleteNoneRank(counter)).toEqual(expected);
        });
    });
});
