import Rank, { determineRank } from '../src/js/domain/models/Rank/Rank.js';
import {
    RankNotNumberError,
    RankOutOfRangeError,
} from '../src/js/domain/models/Rank/errors.js';

describe('Rank 생성자 테스트', () => {
    describe('Rank 유효성 테스트', () => {
        describe('순위가 숫자 형태가 아니면, 에러를 발생시킨다.', () => {
            it.each([
                '1',
                'erica',
                true,
                null,
                undefined,
                function () {},
                {},
                [],
            ])('rank: %p', (rank) => {
                expect(() => new Rank(rank)).toThrow(RankNotNumberError);
            });
        });

        describe('순위가 [1, 6] 사이를 벗어나면, 에러를 발생시킨다.', () => {
            it.each([0, 7])('rank: %p', (rank) => {
                expect(() => new Rank(rank)).toThrow(RankOutOfRangeError);
            });
        });

        describe('순위가 유효한 경우, 에러를 발생시키지 않는다.', () => {
            it.each([1, 2, 3, 4, 5, 6])('rank: %p', (rank) => {
                expect(() => new Rank(rank)).not.toThrow();
            });
        });
    });
});

describe('static of() 테스트', () => {
    describe('Rank 객체를 반환한다.', () => {
        it.each([1, 6])('rank: %p', (rank) => {
            expect(Rank.of(rank)).toBeInstanceOf(Rank);
        });
    });
});

describe('get rank 테스트', () => {
    describe('rank를 반환한다.', () => {
        it.each([1, 2, 3, 4, 5, 6])('rank: %p', (rank) => {
            expect(new Rank(rank).rank).toBe(rank);
        });
    });
});

describe('get prize 테스트', () => {
    describe('prize를 반환한다.', () => {
        it.each([
            { rank: 1, prize: 2_000_000_000 },
            { rank: 2, prize: 30_000_000 },
            { rank: 3, prize: 1_500_000 },
            { rank: 4, prize: 50_000 },
            { rank: 5, prize: 5_000 },
            { rank: 6, prize: 0 },
        ])('rank: %rank, prize: $prize', ({ rank, prize }) => {
            expect(new Rank(rank).prize).toBe(prize);
        });
    });
});

describe('determineRank(matchCount, isBonusMatch) 테스트', () => {
    describe('matchCount와 isBonusMatch에 따라, Rank를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, rank: 1 },
            { matchCount: 5, isBonusMatch: true, rank: 2 },
            { matchCount: 5, isBonusMatch: false, rank: 3 },
            { matchCount: 4, isBonusMatch: false, rank: 4 },
            { matchCount: 3, isBonusMatch: false, rank: 5 },
        ])(
            'matchCount: %matchCount, isBonusMatch: %isBonusMatch, rank: $rank',
            ({ matchCount, isBonusMatch, rank }) => {
                expect(determineRank(matchCount, isBonusMatch).rank).toBe(rank);
            },
        );
    });
});
