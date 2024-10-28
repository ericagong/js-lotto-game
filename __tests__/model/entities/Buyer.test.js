import Buyer from '../../../src/js/domain/models/entities/Buyer/Buyer.js';
import {
    NotNumberError,
    BelowMinBudgetError,
    AboveMaxBudgetError,
} from '../../../src/js/domain/models/entities/Buyer/errors.js';

describe('static of(budget) 테스트', () => {
    describe('Buyer 객체를 반환한다.', () => {
        it.each([1_0000, 100_000])('budget: $budget', (budget) => {
            const buyer = Buyer.of(budget);
            expect(buyer).toEqual(new Buyer(budget));
        });
    });
});

describe('new Buyer(budget) 테스트', () => {
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
                expect(() => new Buyer(budget)).toThrow(NotNumberError);
            });
        });

        describe('budget이 1_000 보다 작은 경우, 에러를 발생시킨다.', () => {
            it.each([0, 10, 100, 999])('budget: %p', (budget) => {
                expect(() => new Buyer(budget)).toThrow(BelowMinBudgetError);
            });
        });

        describe('budget이 100_000 보다 큰 경우, 에러를 발생시킨다.', () => {
            it.each([100_001, 1_000_000])('budget: %p', (budget) => {
                expect(() => new Buyer(budget)).toThrow(AboveMaxBudgetError);
            });
        });

        describe('budger이 [1_000, 100_000] 사이 숫자인 경우, 에러를 발생시키지 않는다.', () => {
            it.each([1_000, 10_000, 100_000])('budget: %p', (budget) => {
                expect(() => new Buyer(budget)).not.toThrow();
            });
        });
    });
});

describe('getIssueCount() 테스트', () => {
    describe('issueCount를 반환한다.', () => {
        it.each([
            { budget: 1_000, expected: 1 },
            { budget: 10_000, expected: 10 },
            { budget: 100_000, expected: 100 },
        ])('budget: $budget', ({ budget, expected }) => {
            const buyer = new Buyer(budget);
            expect(buyer.getIssueCount()).toBe(expected);
        });
    });
});
