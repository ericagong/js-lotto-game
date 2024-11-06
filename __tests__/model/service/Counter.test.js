import Counter from '../../../src/js/domain/models/service/Counter/index.js';
import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';

const { countRanks, removeNoPrizeRank } = Counter;

describe('countRanks(ranks) 테스트', () => {
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
                expect(countRanks(ranks)).toEqual(expected);
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
                expect(countRanks(ranks)).toEqual(expected);
            });
        });
    });
});

describe('removeNoPrizeRank(counter) 테스트', () => {
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
            expect(removeNoPrizeRank(counter)).toEqual(expected);
        });
    });
});
