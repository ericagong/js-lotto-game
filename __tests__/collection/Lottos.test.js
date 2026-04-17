import Lotto from '../../src/js/domain/entity/Lotto/Lotto.js';
import LottoNumber from '../../src/js/domain/entity/LottoNumber/LottoNumber.js';
import Lottos from '../../src/js/domain/collection/Lottos/Lottos.js';
import WinningLotto from '../../src/js/domain/entity/WinningLotto/WinningLotto.js';
import Rank from '../../src/js/domain/entity/Rank/Rank.js';
import { LottosNotArrayError, ElementNotLottoInstanceError } from '../../src/js/domain/collection/Lottos/errors.js';

describe('static of(numbersList) 테스트', () => {
    it('각 numbers를 Lotto로 감싸 Lottos 인스턴스를 반환한다.', () => {
        const numbersList = [
            [1, 2, 3, 4, 5, 6],
            [10, 11, 12, 13, 14, 15],
        ];
        const lottos = Lottos.of(numbersList);
        expect(lottos).toBeInstanceOf(Lottos);
        expect(lottos.count).toBe(2);
        expect(lottos.toNumbersList()).toEqual(numbersList);
    });

    it('빈 배열로 생성하면, count가 0이다.', () => {
        const lottos = Lottos.of([]);
        expect(lottos.count).toBe(0);
        expect(lottos.toNumbersList()).toEqual([]);
    });
});

describe('static from(lottos) 테스트', () => {
    it('Lotto 인스턴스 배열로 Lottos를 생성한다.', () => {
        const lottoList = [Lotto.of([1, 2, 3, 4, 5, 6]), Lotto.of([10, 11, 12, 13, 14, 15])];
        const lottos = Lottos.from(lottoList);
        expect(lottos).toBeInstanceOf(Lottos);
        expect(lottos.count).toBe(2);
    });

    it('빈 배열로 생성할 수 있다.', () => {
        const lottos = Lottos.from([]);
        expect(lottos.count).toBe(0);
    });
});

describe('new Lottos(lottos) 유효성 검사 테스트', () => {
    describe('lottos가 배열이 아닌 경우, 에러를 발생시킨다.', () => {
        it.each([null, undefined, '1', 1, {}, 'erica'])('lottos: %p', (lottos) => {
            expect(() => new Lottos(lottos)).toThrow(LottosNotArrayError);
        });
    });

    describe('lottos의 원소 중 Lotto 인스턴스가 아닌 값이 있는 경우, 에러를 발생시킨다.', () => {
        it.each([
            [[Lotto.of([1, 2, 3, 4, 5, 6]), null]],
            [[Lotto.of([1, 2, 3, 4, 5, 6]), 'erica']],
            [[Lotto.of([1, 2, 3, 4, 5, 6]), {}]],
            [[Lotto.of([1, 2, 3, 4, 5, 6]), [1, 2, 3, 4, 5, 6]]],
        ])('lottos: %p', (lottos) => {
            expect(() => new Lottos(lottos)).toThrow(ElementNotLottoInstanceError);
        });
    });

    it('유효한 Lotto 배열이면, 에러를 발생시키지 않는다.', () => {
        expect(() => new Lottos([Lotto.of([1, 2, 3, 4, 5, 6])])).not.toThrow();
    });
});

describe('determineRanks(winningLotto) 테스트', () => {
    const winningLotto = WinningLotto.of(Lotto.of([1, 2, 3, 4, 5, 6]), LottoNumber.of(7));

    it('모든 로또가 1등인 경우, 모두 FIRST를 반환한다.', () => {
        const lottos = Lottos.of([
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
        ]);
        const ranks = lottos.determineRanks(winningLotto);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 2 },
            { rank: Rank.SECOND, count: 0 },
            { rank: Rank.THIRD, count: 0 },
            { rank: Rank.FOURTH, count: 0 },
            { rank: Rank.FIFTH, count: 0 },
        ]);
    });

    it('전부 미당첨인 경우, 모든 등수 count가 0이다.', () => {
        const lottos = Lottos.of([
            [40, 41, 42, 43, 44, 45],
            [34, 35, 36, 37, 38, 39],
        ]);
        const ranks = lottos.determineRanks(winningLotto);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 0 },
            { rank: Rank.SECOND, count: 0 },
            { rank: Rank.THIRD, count: 0 },
            { rank: Rank.FOURTH, count: 0 },
            { rank: Rank.FIFTH, count: 0 },
        ]);
    });

    it('보너스 매치를 포함한 혼합 결과를 올바르게 판정한다.', () => {
        const lottos = Lottos.of([
            [1, 2, 3, 4, 5, 7],
            [1, 2, 3, 4, 5, 45],
            [1, 2, 3, 4, 44, 45],
            [40, 41, 42, 43, 44, 45],
        ]);
        const ranks = lottos.determineRanks(winningLotto);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 0 },
            { rank: Rank.SECOND, count: 1 },
            { rank: Rank.THIRD, count: 1 },
            { rank: Rank.FOURTH, count: 1 },
            { rank: Rank.FIFTH, count: 0 },
        ]);
    });

    it('빈 Lottos에서 determineRanks를 호출하면, 모든 count가 0이다.', () => {
        const lottos = Lottos.of([]);
        const ranks = lottos.determineRanks(winningLotto);
        expect(ranks.countByRank()).toEqual([
            { rank: Rank.FIRST, count: 0 },
            { rank: Rank.SECOND, count: 0 },
            { rank: Rank.THIRD, count: 0 },
            { rank: Rank.FOURTH, count: 0 },
            { rank: Rank.FIFTH, count: 0 },
        ]);
    });
});
