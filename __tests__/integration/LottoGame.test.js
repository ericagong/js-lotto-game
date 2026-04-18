import LottoGame from '../../src/js/domain/LottoGame.js';
import Lotto from '../../src/js/domain/entity/Lotto/Lotto.js';
import Rank from '../../src/js/domain/entity/Rank/Rank.js';
import DomainError from '../../src/js/domain/DomainError.js';
import {
    BudgetNotNumberError,
    BudgetBelowMinError,
    BudgetAboveMaxError,
} from '../../src/js/domain/service/LottoMachine/errors.js';
import {
    NumbersNotArrayError,
    NumbersInvalidLengthError,
    NumbersDuplicatedError,
} from '../../src/js/domain/entity/Lotto/errors.js';
import { ValueNotNumberError, ValueOutOfRangeError } from '../../src/js/domain/entity/LottoNumber/errors.js';
import { BonusNumberDuplicatedError } from '../../src/js/domain/entity/WinningLotto/errors.js';

describe('LottoGame 통합 테스트', () => {
    let game;

    beforeEach(() => {
        game = new LottoGame();
    });

    describe('issueLottos(budget) 테스트', () => {
        describe('budget이 Number 타입이 아닌 경우, 에러를 발생시킨다.', () => {
            it.each(['1000', true, false, null, undefined, {}, [], function () {}])('budget: %p', (budget) => {
                expect(() => game.issueLottos(budget)).toThrow(BudgetNotNumberError);
            });
        });

        describe('budget이 1,000 미만인 경우, 에러를 발생시킨다.', () => {
            it.each([0, 1, 999, -1, -1000])('budget: %p', (budget) => {
                expect(() => game.issueLottos(budget)).toThrow(BudgetBelowMinError);
            });
        });

        describe('budget이 100,000 초과인 경우, 에러를 발생시킨다.', () => {
            it.each([100_001, 200_000, 1_000_000])('budget: %p', (budget) => {
                expect(() => game.issueLottos(budget)).toThrow(BudgetAboveMaxError);
            });
        });

        describe('유효한 budget에 대해 올바른 발행 결과를 반환한다.', () => {
            it.each([
                { budget: 1_000, expectedCount: 1 },
                { budget: 1_500, expectedCount: 1 },
                { budget: 2_000, expectedCount: 2 },
                { budget: 3_000, expectedCount: 3 },
                { budget: 9_999, expectedCount: 9 },
                { budget: 10_900, expectedCount: 10 },
                { budget: 50_500, expectedCount: 50 },
                { budget: 100_000, expectedCount: 100 },
            ])('budget: $budget → $expectedCount장', ({ budget, expectedCount }) => {
                const result = game.issueLottos(budget);

                expect(result.issuedCount).toBe(expectedCount);
                expect(result.issuedLottosNumbers).toHaveLength(expectedCount);
                result.issuedLottosNumbers.forEach((numbers) => {
                    expect(numbers).toHaveLength(6);
                    numbers.forEach((n) => {
                        expect(n).toBeGreaterThanOrEqual(1);
                        expect(n).toBeLessThanOrEqual(45);
                    });
                });
            });
        });
    });

    describe('setWinningLotto(winningNumbers, bonusNumber) 테스트', () => {
        it('로또를 발행하지 않은 상태에서 호출하면, 에러를 발생시킨다.', () => {
            expect(() => game.setWinningLotto([1, 2, 3, 4, 5, 6], 7)).toThrow(DomainError);
        });

        describe('winningNumbers가 배열이 아닌 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([1, 'erica', true, null, undefined, {}, function () {}])('winningNumbers: %p', (winningNumbers) => {
                expect(() => game.setWinningLotto(winningNumbers, 7)).toThrow(NumbersNotArrayError);
            });
        });

        describe('winningNumbers의 길이가 6이 아닌 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([{ numbers: [] }, { numbers: [1, 2, 3] }, { numbers: [1, 2, 3, 4, 5, 6, 7] }])(
                '$numbers',
                ({ numbers }) => {
                    expect(() => game.setWinningLotto(numbers, 7)).toThrow(NumbersInvalidLengthError);
                },
            );
        });

        describe('winningNumbers에 중복이 있는 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([{ numbers: [1, 1, 2, 3, 4, 5] }, { numbers: [1, 2, 3, 4, 5, 5] }])('$numbers', ({ numbers }) => {
                expect(() => game.setWinningLotto(numbers, 7)).toThrow(NumbersDuplicatedError);
            });
        });

        describe('winningNumbers의 원소가 [1, 45] 범위 밖인 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([{ numbers: [0, 2, 3, 4, 5, 6] }, { numbers: [1, 2, 3, 4, 5, 46] }])('$numbers', ({ numbers }) => {
                expect(() => game.setWinningLotto(numbers, 7)).toThrow(ValueOutOfRangeError);
            });
        });

        describe('bonusNumber가 Number 타입이 아닌 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each(['7', true, null, undefined, {}, []])('bonusNumber: %p', (bonus) => {
                expect(() => game.setWinningLotto([1, 2, 3, 4, 5, 6], bonus)).toThrow(ValueNotNumberError);
            });
        });

        describe('bonusNumber가 [1, 45] 범위 밖인 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([0, 46, -1, 100])('bonusNumber: %p', (bonus) => {
                expect(() => game.setWinningLotto([1, 2, 3, 4, 5, 6], bonus)).toThrow(ValueOutOfRangeError);
            });
        });

        describe('bonusNumber가 winningNumbers와 중복인 경우, 에러를 발생시킨다.', () => {
            beforeEach(() => game.issueLottos(1_000));

            it.each([1, 2, 3, 4, 5, 6])('bonusNumber: %p', (bonus) => {
                expect(() => game.setWinningLotto([1, 2, 3, 4, 5, 6], bonus)).toThrow(BonusNumberDuplicatedError);
            });
        });

        it('유효한 입력이면, 에러를 발생시키지 않는다.', () => {
            game.issueLottos(1_000);
            expect(() => game.setWinningLotto([1, 2, 3, 4, 5, 6], 7)).not.toThrow();
        });
    });

    describe('getStatistics() 테스트', () => {
        it('로또를 발행하지 않은 상태에서 호출하면, 에러를 발생시킨다.', () => {
            expect(() => game.getStatistics()).toThrow(DomainError);
        });

        it('당첨번호를 설정하지 않은 상태에서 호출하면, 에러를 발생시킨다.', () => {
            game.issueLottos(1_000);
            expect(() => game.getStatistics()).toThrow(DomainError);
        });

        it('발행과 당첨번호 설정 후 호출하면, rankSummary 5개와 revenueRate를 반환한다.', () => {
            game.issueLottos(5_000);
            game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
            const stats = game.getStatistics();

            expect(stats.rankSummary).toHaveLength(5);
            stats.rankSummary.forEach(({ rank, count }) => {
                expect(Rank.isRank(rank)).toBe(true);
                expect(typeof count).toBe('number');
                expect(count).toBeGreaterThanOrEqual(0);
            });
            expect(typeof stats.revenueRate).toBe('number');
            expect(stats.revenueRate).toBeGreaterThanOrEqual(0);
        });
    });

    describe('구매 → 당첨 설정 → 통계 조회 전체 플로우 검증', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('1장 구매: 등수별 수익률을 올바르게 반환한다.', () => {
            it.each([
                { name: '1등', numbers: [1, 2, 3, 4, 5, 6], expectedRank: Rank.FIRST, prize: 2_000_000_000 },
                { name: '2등', numbers: [1, 2, 3, 4, 5, 7], expectedRank: Rank.SECOND, prize: 30_000_000 },
                { name: '3등', numbers: [1, 2, 3, 4, 5, 45], expectedRank: Rank.THIRD, prize: 1_500_000 },
                { name: '4등', numbers: [1, 2, 3, 4, 44, 45], expectedRank: Rank.FOURTH, prize: 50_000 },
                { name: '5등', numbers: [1, 2, 3, 43, 44, 45], expectedRank: Rank.FIFTH, prize: 5_000 },
                { name: '꽝', numbers: [40, 41, 42, 43, 44, 45], expectedRank: null, prize: 0 },
            ])('$name', ({ numbers, expectedRank, prize }) => {
                jest.spyOn(Lotto, 'random').mockReturnValue(Lotto.of(numbers));
                game.issueLottos(1_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                if (expectedRank) {
                    expect(stats.rankSummary.find((s) => s.rank === expectedRank).count).toBe(1);
                } else {
                    stats.rankSummary.forEach((s) => expect(s.count).toBe(0));
                }
                expect(stats.revenueRate).toBe(prize / 1_000);
            });
        });

        describe('여러 장 구매: 전체 동일 결과의 수익률을 올바르게 반환한다.', () => {
            it('전체 1등 (3장)', () => {
                jest.spyOn(Lotto, 'random').mockReturnValue(Lotto.of([1, 2, 3, 4, 5, 6]));
                game.issueLottos(3_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                expect(stats.rankSummary.find((s) => s.rank === Rank.FIRST).count).toBe(3);
                expect(stats.revenueRate).toBe((2_000_000_000 * 3) / 3_000);
            });

            it('전체 5등 (3장)', () => {
                jest.spyOn(Lotto, 'random').mockReturnValue(Lotto.of([1, 2, 3, 43, 44, 45]));
                game.issueLottos(3_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                expect(stats.rankSummary.find((s) => s.rank === Rank.FIFTH).count).toBe(3);
                expect(stats.revenueRate).toBe((5_000 * 3) / 3_000);
            });

            it('전체 꽝 (2장)', () => {
                jest.spyOn(Lotto, 'random').mockReturnValue(Lotto.of([40, 41, 42, 43, 44, 45]));
                game.issueLottos(2_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                stats.rankSummary.forEach((s) => expect(s.count).toBe(0));
                expect(stats.revenueRate).toBe(0);
            });
        });

        describe('여러 장 구매: 혼합 결과의 등수별 카운트와 수익률을 올바르게 반환한다.', () => {
            it('1등 1장, 2등 1장, 5등 1장, 낙첨 1장', () => {
                const mockLottos = [
                    Lotto.of([1, 2, 3, 4, 5, 6]),
                    Lotto.of([1, 2, 3, 4, 5, 7]),
                    Lotto.of([1, 2, 3, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                ];
                let callCount = 0;
                jest.spyOn(Lotto, 'random').mockImplementation(() => mockLottos[callCount++]);

                game.issueLottos(4_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                expect(stats.rankSummary.find((s) => s.rank === Rank.FIRST).count).toBe(1);
                expect(stats.rankSummary.find((s) => s.rank === Rank.SECOND).count).toBe(1);
                expect(stats.rankSummary.find((s) => s.rank === Rank.FIFTH).count).toBe(1);
                expect(stats.revenueRate).toBe((2_000_000_000 + 30_000_000 + 5_000) / 4_000);
            });

            it('3등 2장, 4등 1장, 낙첨 2장', () => {
                const mockLottos = [
                    Lotto.of([1, 2, 3, 4, 5, 45]),
                    Lotto.of([1, 2, 3, 4, 5, 44]),
                    Lotto.of([1, 2, 3, 4, 43, 44]),
                    Lotto.of([1, 2, 42, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                ];
                let callCount = 0;
                jest.spyOn(Lotto, 'random').mockImplementation(() => mockLottos[callCount++]);

                game.issueLottos(5_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                expect(stats.rankSummary.find((s) => s.rank === Rank.THIRD).count).toBe(2);
                expect(stats.rankSummary.find((s) => s.rank === Rank.FOURTH).count).toBe(1);
                expect(stats.revenueRate).toBe((1_500_000 * 2 + 50_000) / 5_000);
            });

            it('2등 3장, 5등 2장, 낙첨 5장', () => {
                const mockLottos = [
                    Lotto.of([1, 2, 3, 4, 5, 7]),
                    Lotto.of([1, 2, 3, 4, 5, 7]),
                    Lotto.of([1, 2, 3, 4, 5, 7]),
                    Lotto.of([1, 2, 3, 43, 44, 45]),
                    Lotto.of([1, 2, 3, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                    Lotto.of([40, 41, 42, 43, 44, 45]),
                ];
                let callCount = 0;
                jest.spyOn(Lotto, 'random').mockImplementation(() => mockLottos[callCount++]);

                game.issueLottos(10_000);
                game.setWinningLotto([1, 2, 3, 4, 5, 6], 7);
                const stats = game.getStatistics();

                expect(stats.rankSummary.find((s) => s.rank === Rank.SECOND).count).toBe(3);
                expect(stats.rankSummary.find((s) => s.rank === Rank.FIFTH).count).toBe(2);
                expect(stats.revenueRate).toBe((30_000_000 * 3 + 5_000 * 2) / 10_000);
            });
        });
    });
});
