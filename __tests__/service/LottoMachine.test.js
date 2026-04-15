import Lotto from '../../src/js/domain/entity/Lotto/Lotto.js';
import Lottos from '../../src/js/domain/collection/Lottos/Lottos.js';
import LottoMachine from '../../src/js/domain/service/LottoMachine/LottoMachine.js';

describe('static issue(budgetAmount) 테스트', () => {
    describe('budgetAmount에 해당하는 수량만큼 무작위 Lotto를 발행한 { lottos, totalCost }를 반환한다.', () => {
        it.each([
            { amount: 1_000, expectedCount: 1, expectedCost: 1_000 },
            { amount: 1_500, expectedCount: 1, expectedCost: 1_000 },
            { amount: 2_000, expectedCount: 2, expectedCost: 2_000 },
            { amount: 3_000, expectedCount: 3, expectedCost: 3_000 },
            { amount: 10_000, expectedCount: 10, expectedCost: 10_000 },
            { amount: 100_000, expectedCount: 100, expectedCost: 100_000 },
        ])('amount: $amount', ({ amount, expectedCount, expectedCost }) => {
            const { lottos, totalCost } = LottoMachine.issue(amount);
            expect(lottos).toBeInstanceOf(Lottos);
            expect(lottos.count).toBe(expectedCount);
            expect(totalCost).toBe(expectedCost);
        });
    });

    it('snapshot의 각 lotto는 길이 6의 배열이고, 모든 번호는 [1, 45] 사이의 정수다.', () => {
        const { lottos } = LottoMachine.issue(5_000);

        lottos.snapshot.forEach((numbers) => {
            expect(numbers).toHaveLength(Lotto.DIGITS);
            numbers.forEach((number) => {
                expect(Number.isInteger(number)).toBe(true);
                expect(number).toBeGreaterThanOrEqual(1);
                expect(number).toBeLessThanOrEqual(45);
            });
        });
    });
});
