import LottoStore from '../../../src/js/domain/models/entities/LottoStore/LottoStore.js';
import {
    BudgetNotNumberError,
    BudgetBelowMinError,
    BudgetAboveMaxError,
} from '../../../src/js/domain/models/entities/LottoStore/errors.js';
import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';

describe('static of(budget) 테스트', () => {
    describe('LottoStore 인스턴스를 반환한다.', () => {
        it.each([1_0000, 100_000])('budget: $budget', (budget) => {
            const lottoStore = LottoStore.of(budget);
            expect(lottoStore).toEqual(new LottoStore(budget));
        });
    });
});

describe('new LottoStore(budget) 테스트', () => {
    describe('budget 유효성 검사 테스트', () => {
        describe('budget이 숫자 형태가 아닌 경우, 에러를 발생시킨다.', () => {
            it.each([
                '1',
                'erica',
                true,
                null,
                undefined,
                function () {},
                {},
                [],
            ])('budget: %p', (budget) => {
                expect(() => new LottoStore(budget)).toThrow(
                    BudgetNotNumberError,
                );
            });
        });

        describe('budget이 1_000 보다 작은 경우, 에러를 발생시킨다.', () => {
            it.each([0, 10, 100, 999])('budget: %p', (budget) => {
                expect(() => new LottoStore(budget)).toThrow(
                    BudgetBelowMinError,
                );
            });
        });

        describe('budget이 100_000 보다 큰 경우, 에러를 발생시킨다.', () => {
            it.each([100_001, 1_000_000])('budget: %p', (budget) => {
                expect(() => new LottoStore(budget)).toThrow(
                    BudgetAboveMaxError,
                );
            });
        });

        describe('budger이 [1_000, 100_000] 사이 숫자인 경우, 에러를 발생시키지 않는다.', () => {
            it.each([1_000, 10_000, 100_000])('budget: %p', (budget) => {
                expect(() => new LottoStore(budget)).not.toThrow();
            });
        });
    });
});

describe('getLottos() 테스트', () => {
    describe('주어진 budget에서 가능한 최대 개수를 길이로 하는 Lotto 인스턴스 배열을 반환한다.', () => {
        it.each([
            { budget: 1_000, expected: 1 },
            { budget: 1_500, expected: 1 },
            { budget: 2_000, expected: 2 },
            { budget: 3_000, expected: 3 },
            { budget: 10_000, expected: 10 },
            { budget: 100_000, expected: 100 },
        ])('budget: $budget, expected: $expected', ({ budget, expected }) => {
            const lottoStore = new LottoStore(budget);
            const lottos = lottoStore.getLottos();
            expect(lottos).toHaveLength(expected);
            expect(lottos.every((lotto) => lotto instanceof Lotto)).toBe(true);
        });
    });
});
