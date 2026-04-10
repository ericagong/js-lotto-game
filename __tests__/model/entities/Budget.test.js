import Budget from '../../../src/js/domain/Budget/Budget.js';
import {
    BudgetNotNumberError,
    BudgetBelowMinError,
    BudgetAboveMaxError,
} from '../../../src/js/domain/Budget/errors.js';

describe('static of(amount) 테스트', () => {
    describe('Budget 인스턴스를 반환한다.', () => {
        it.each([1_0000, 100_000])('amount: $amount', (amount) => {
            const budget = Budget.of(amount);
            expect(budget).toEqual(new Budget(amount));
        });
    });
});

describe('new Budget(amount) 테스트', () => {
    describe('amount 유효성 검사 테스트', () => {
        describe('amount가 숫자 형태가 아닌 경우, 에러를 발생시킨다.', () => {
            it.each([
                '1',
                'erica',
                true,
                null,
                undefined,
                function () {},
                {},
                [],
            ])('amount: %p', (amount) => {
                expect(() => new Budget(amount)).toThrow(BudgetNotNumberError);
            });
        });

        describe('amount가 1_000 보다 작은 경우, 에러를 발생시킨다.', () => {
            it.each([0, 10, 100, 999])('amount: %p', (amount) => {
                expect(() => new Budget(amount)).toThrow(BudgetBelowMinError);
            });
        });

        describe('amount가 100_000 보다 큰 경우, 에러를 발생시킨다.', () => {
            it.each([100_001, 1_000_000])('amount: %p', (amount) => {
                expect(() => new Budget(amount)).toThrow(BudgetAboveMaxError);
            });
        });

        describe('amount가 [1_000, 100_000] 사이 숫자인 경우, 에러를 발생시키지 않는다.', () => {
            it.each([1_000, 10_000, 100_000])('amount: %p', (amount) => {
                expect(() => new Budget(amount)).not.toThrow();
            });
        });
    });
});

describe('get maxIssueCount 테스트', () => {
    describe('amount를 UNIT_PRICE로 나눈 몫(살 수 있는 최대 로또 개수)을 반환한다.', () => {
        it.each([
            { amount: 1_000, expected: 1 },
            { amount: 1_500, expected: 1 },
            { amount: 2_000, expected: 2 },
            { amount: 3_000, expected: 3 },
            { amount: 10_000, expected: 10 },
            { amount: 100_000, expected: 100 },
        ])('amount: $amount, expected: $expected', ({ amount, expected }) => {
            const budget = Budget.of(amount);
            expect(budget.maxIssueCount).toBe(expected);
        });
    });
});

describe('get totalCost 테스트', () => {
    describe('실제 발행에 사용되는 금액(maxIssueCount × UNIT_PRICE)을 반환한다 — 거스름돈은 제외.', () => {
        it.each([
            { amount: 1_000, expected: 1_000 },
            { amount: 1_500, expected: 1_000 }, // 거스름돈 500원
            { amount: 2_000, expected: 2_000 },
            { amount: 2_999, expected: 2_000 }, // 거스름돈 999원
            { amount: 100_000, expected: 100_000 },
        ])('amount: $amount, expected: $expected', ({ amount, expected }) => {
            const budget = Budget.of(amount);
            expect(budget.totalCost).toBe(expected);
        });
    });
});
