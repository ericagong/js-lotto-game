import Budget from '../../src/js/domain/Budget/Budget.js';
import Lotto from '../../src/js/domain/Lotto/Lotto.js';
import Lottos from '../../src/js/domain/Lottos/Lottos.js';

describe('static issue(budget) 테스트', () => {
    describe('budget.maxIssueCount만큼 무작위 Lotto를 발행한 Lottos 인스턴스를 반환한다.', () => {
        it.each([
            { amount: 1_000, expected: 1 },
            { amount: 1_500, expected: 1 },
            { amount: 2_000, expected: 2 },
            { amount: 3_000, expected: 3 },
            { amount: 10_000, expected: 10 },
            { amount: 100_000, expected: 100 },
        ])('amount: $amount, expected: $expected', ({ amount, expected }) => {
            const budget = Budget.of(amount);
            const lottos = Lottos.issue(budget);
            expect(lottos).toBeInstanceOf(Lottos);
            expect(lottos.count).toBe(expected);
        });
    });

    it('snapshot의 각 lotto는 길이 6의 배열이고, 모든 번호는 [1, 45] 사이의 정수다.', () => {
        const budget = Budget.of(5_000);
        const lottos = Lottos.issue(budget);
        const snapshot = lottos.snapshot;

        snapshot.forEach((numbers) => {
            expect(numbers).toHaveLength(Lotto.DIGITS);
            numbers.forEach((number) => {
                expect(Number.isInteger(number)).toBe(true);
                expect(number).toBeGreaterThanOrEqual(1);
                expect(number).toBeLessThanOrEqual(45);
            });
        });
    });
});

describe('static of(numbersList) 테스트', () => {
    it('각 numbers를 Lotto로 감싸 Lottos 인스턴스를 반환한다.', () => {
        const numbersList = [
            [1, 2, 3, 4, 5, 6],
            [10, 11, 12, 13, 14, 15],
        ];
        const lottos = Lottos.of(numbersList);
        expect(lottos).toBeInstanceOf(Lottos);
        expect(lottos.count).toBe(2);
        expect(lottos.snapshot).toEqual(numbersList);
    });
});
