import Rank from '../../src/js/domain/entity/Rank/Rank.js';
import Ranks from '../../src/js/domain/collection/Ranks/Ranks.js';
import { RanksNotArrayError, RankNotRankInstanceError } from '../../src/js/domain/collection/Ranks/errors.js';

describe('new Ranks(ranks) 유효성 검사 테스트', () => {
    describe('ranks가 배열이 아닌 경우, 에러를 발생시킨다.', () => {
        it.each([null, undefined, '1', 1, {}])('ranks: %p', (ranks) => {
            expect(() => Ranks.from(ranks)).toThrow(RanksNotArrayError);
        });
    });

    describe('ranks의 원소 중 Rank 인스턴스가 아닌 값이 있는 경우, 에러를 발생시킨다.', () => {
        it.each([[[Rank.FIRST, null]], [[Rank.FIRST, 'NONE']], [[Rank.FIRST, {}]], [[Rank.FIRST, 1]]])(
            'ranks: %p',
            (ranks) => {
                expect(() => Ranks.from(ranks)).toThrow(RankNotRankInstanceError);
            },
        );
    });

    it('유효한 Rank 배열이라면, 에러를 발생시키지 않는다.', () => {
        expect(() => Ranks.from([Rank.FIRST, Rank.FIFTH])).not.toThrow();
    });

    it('빈 배열도 유효하다.', () => {
        expect(() => Ranks.from([])).not.toThrow();
    });
});

describe('countByRank() 테스트', () => {
    it('당첨 등수(1~5등)별 개수를 반환한다.', () => {
        const ranks = Ranks.from([Rank.FIRST, Rank.FIFTH]);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 1 },
            { rank: Rank.SECOND, count: 0 },
            { rank: Rank.THIRD, count: 0 },
            { rank: Rank.FOURTH, count: 0 },
            { rank: Rank.FIFTH, count: 1 },
        ]);
    });

    it('빈 배열이면 전부 0이다.', () => {
        const ranks = Ranks.from([]);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 0 },
            { rank: Rank.SECOND, count: 0 },
            { rank: Rank.THIRD, count: 0 },
            { rank: Rank.FOURTH, count: 0 },
            { rank: Rank.FIFTH, count: 0 },
        ]);
    });
});

describe('calculateTotalPrize() 테스트', () => {
    it('모든 Rank의 상금을 합산한다.', () => {
        const ranks = Ranks.from([Rank.FIRST, Rank.FIFTH]);
        expect(ranks.calculateTotalPrize()).toBe(2_000_005_000);
    });

    it('빈 배열이면 0이다.', () => {
        const ranks = Ranks.from([]);
        expect(ranks.calculateTotalPrize()).toBe(0);
    });
});
