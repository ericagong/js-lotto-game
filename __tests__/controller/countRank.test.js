import Rank from '../../src/js/domain/models/Rank/Rank.js';
import countRanks from '../../src/js/controller/countRanks.js';

describe('countRanks(ranks) 테스트', () => {
    describe('rank 개수를 [1등, 2등, 3등, 4등, 5등, 없음] 배열 형태로 세어 반환한다.', () => {
        Rank.initializeRanks();

        describe('로또가 1개인 경우', () => {
            it.each([
                {
                    rankIndex: 1,
                    expected: new Map([
                        [Rank.of(1), 1],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 0],
                        [Rank.of(6), 0],
                    ]),
                },
                {
                    rankIndex: 2,
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 1],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 0],
                        [Rank.of(6), 0],
                    ]),
                },
                {
                    rankIndex: 3,
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 1],
                        [Rank.of(4), 0],
                        [Rank.of(5), 0],
                        [Rank.of(6), 0],
                    ]),
                },
                {
                    rankIndex: 4,
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 1],
                        [Rank.of(5), 0],
                        [Rank.of(6), 0],
                    ]),
                },
                {
                    rankIndex: 5,
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 1],
                        [Rank.of(6), 0],
                    ]),
                },
                {
                    rankIndex: 6,
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 0],
                        [Rank.of(6), 1],
                    ]),
                },
            ])('rankIndex: $rankIndex', ({ rankIndex, expected }) => {
                const ranks = [Rank.of(rankIndex)];
                expect(countRanks(ranks)).toEqual(expected);
            });
        });

        describe('로또가 여러 개인 경우', () => {
            const testCases = [
                {
                    rankIndexes: [1, 2, 3, 4, 5, 6],
                    expected: new Map([
                        [Rank.of(1), 1],
                        [Rank.of(2), 1],
                        [Rank.of(3), 1],
                        [Rank.of(4), 1],
                        [Rank.of(5), 1],
                        [Rank.of(6), 1],
                    ]),
                },
                {
                    rankIndexes: [1, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 1],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 1],
                        [Rank.of(6), 4],
                    ]),
                },
                {
                    rankIndexes: [2, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 1],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 1],
                        [Rank.of(6), 4],
                    ]),
                },
                {
                    rankIndexes: [3, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 1],
                        [Rank.of(4), 0],
                        [Rank.of(5), 1],
                        [Rank.of(6), 4],
                    ]),
                },
                {
                    rankIndexes: [4, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 1],
                        [Rank.of(5), 1],
                        [Rank.of(6), 4],
                    ]),
                },
                {
                    rankIndexes: [5, 5, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 2],
                        [Rank.of(6), 4],
                    ]),
                },
                {
                    rankIndexes: [5, 6, 6, 6, 6, 6, 6, 6],
                    expected: new Map([
                        [Rank.of(1), 0],
                        [Rank.of(2), 0],
                        [Rank.of(3), 0],
                        [Rank.of(4), 0],
                        [Rank.of(5), 1],
                        [Rank.of(6), 7],
                    ]),
                },
            ];

            it.each(testCases)(
                'rankIndexes: $rankIndexes',
                ({ rankIndexes, expected }) => {
                    const ranks = rankIndexes.map((rank) => Rank.of(rank));
                    expect(countRanks(ranks)).toEqual(expected);
                },
            );
        });
    });
});
