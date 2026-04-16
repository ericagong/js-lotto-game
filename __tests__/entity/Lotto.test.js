import Lotto from '../../src/js/domain/entity/Lotto/Lotto.js';
import {
    NumbersNotArrayError,
    NumbersLengthNotSixError,
    NumbersDuplicatedError,
    TargetNotLottoNumberInstanceError,
    TargetNotLottoInstanceError,
} from '../../src/js/domain/entity/Lotto/errors.js';
import LottoNumber from '../../src/js/domain/entity/LottoNumber/LottoNumber.js';
import {
    ValueNotNumberError,
    ValueNotIntegerError,
    ValueOutOfRangeError,
} from '../../src/js/domain/entity/LottoNumber/errors.js';

describe('static of(numbers) 테스트', () => {
    it('Lotto 인스턴스를 반환한다.', () => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const lotto = Lotto.of(numbers);
        expect(lotto).toEqual(new Lotto(numbers));
    });
});

describe('new Lotto(numbers) 테스트', () => {
    describe('numbers 유효성 검사 테스트', () => {
        describe('유효하지 않은 경우, 에러를 발생시킨다.', () => {
            describe('numbers가 Array 타입이가 아닌 경우', () => {
                it.each([
                    1,
                    'erica',
                    true,
                    null,
                    undefined,
                    function () {},
                    {},
                ])('numbers: %p', (numbers) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        NumbersNotArrayError,
                    );
                });
            });

            describe('numbers의 길이가 6이 아닌 경우', () => {
                it.each([
                    { numbers: [] },
                    { numbers: [1, 2, 3, 4, 5] },
                    { numbers: [1, 2, 3, 4, 5, 6, 7] },
                ])('$numbers', ({ numbers }) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        NumbersLengthNotSixError,
                    );
                });
            });

            describe('numbers 중 중복된 값이 있는 경우', () => {
                it.each([
                    { numbers: [1, 1, 1, 1, 1, 1] },
                    { numbers: [1, 2, 3, 4, 5, 5] },
                    { numbers: [1, 2, 3, 4, 5, 1] },
                ])('$numbers', ({ numbers }) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        NumbersDuplicatedError,
                    );
                });
            });

            describe('numbers의 원소가 [1, 45] 범위를 벗어난 경우', () => {
                it.each([
                    { numbers: [1, 2, 3, 4, 5, 100] },
                    { numbers: [0, 2, 3, 4, 5, 6] },
                    { numbers: [1, 2, 3, 4, 5, 46] },
                ])('$numbers', ({ numbers }) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        ValueOutOfRangeError,
                    );
                });
            });

            describe('numbers의 원소가 정수가 아닌 경우', () => {
                it.each([
                    { numbers: [1, 2, 3, 4, 5, 6.5] },
                    { numbers: [1.1, 2, 3, 4, 5, 6] },
                ])('$numbers', ({ numbers }) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        ValueNotIntegerError,
                    );
                });
            });

            describe('numbers의 원소가 Number 타입이 아닌 경우', () => {
                it.each([
                    { numbers: ['1', 2, 3, 4, 5, 6] },
                    { numbers: [1, 2, 3, 4, 5, null] },
                ])('$numbers', ({ numbers }) => {
                    expect(() => new Lotto(numbers)).toThrow(
                        ValueNotNumberError,
                    );
                });
            });
        });

        describe('numbers가 각 요소가 중복되지 않은 길이 6의 Array 타입인 경우, 에러를 발생시키지 않는다.', () => {
            it.each([
                { numbers: [1, 2, 3, 4, 5, 6] },
                { numbers: [1, 2, 3, 4, 5, 45] },
            ])('$numbers', ({ numbers }) => {
                expect(() => new Lotto(numbers)).not.toThrow();
            });
        });
    });

    describe('numbers 정렬 테스트', () => {
        describe('오름차순으로 정렬되어 numbers로 저장된다.', () => {
            it.each([
                {
                    numbers: [6, 5, 4, 3, 2, 1],
                    expected: [1, 2, 3, 4, 5, 6],
                },
                {
                    numbers: [6, 1, 5, 3, 2, 4],
                    expected: [1, 2, 3, 4, 5, 6],
                },
                {
                    numbers: [45, 11, 21, 30, 22, 44],
                    expected: [11, 21, 22, 30, 44, 45],
                },
            ])('$numbers', ({ numbers, expected }) => {
                const lotto = new Lotto(numbers);
                expect(lotto.getNumbers()).toEqual(expected);
            });
        });
    });
});

describe('hasNumber(lottoNumber) 테스트', () => {
    describe('target 유효성 검사 테스트', () => {
        describe('target이 LottoNumber 인스턴스가 아닌 경우, 에러를 발생시킨다.', () => {
            it.each([1, 'erica', true, null, undefined, function () {}, {}])(
                'target: %p',
                (target) => {
                    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
                    expect(() => lotto.hasNumber(target)).toThrow(
                        TargetNotLottoNumberInstanceError,
                    );
                },
            );
        });

        it('target이 LottoNumber 인스턴스인 경우, 에러를 발생시키지 않는다.', () => {
            const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
            expect(() => lotto.hasNumber(LottoNumber.of(1))).not.toThrow();
        });
    });

    describe('numbers에 target이 포함되어 있는지 여부를 반환한다.', () => {
        it.each([
            { numbers: [1, 2, 3, 4, 5, 6], target: 1, expected: true },
            { numbers: [1, 2, 3, 4, 5, 6], target: 6, expected: true },
            { numbers: [1, 2, 3, 4, 5, 6], target: 7, expected: false },
        ])('$numbers, $target', ({ numbers, target, expected }) => {
            const lotto = new Lotto(numbers);
            expect(lotto.hasNumber(LottoNumber.of(target))).toBe(expected);
        });
    });
});

describe('getMatchCount(other) 테스트', () => {
    describe('other 유효성 검사 테스트', () => {
        describe('other가 Lotto 인스턴스가 아닌 경우, 에러를 발생시킨다.', () => {
            it.each([1, 'erica', true, null, undefined, function () {}, {}])(
                'other: %p',
                (other) => {
                    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
                    expect(() => lotto.getMatchCount(other)).toThrow(
                        TargetNotLottoInstanceError,
                    );
                },
            );
        });
    });

    describe('두 로또 간 일치하는 번호 수를 반환한다.', () => {
        it.each([
            { a: [1, 2, 3, 4, 5, 6], b: [1, 2, 3, 4, 5, 6], expected: 6 },
            { a: [1, 2, 3, 4, 5, 6], b: [1, 2, 3, 4, 5, 7], expected: 5 },
            { a: [1, 2, 3, 4, 5, 6], b: [1, 2, 3, 4, 7, 8], expected: 4 },
            { a: [1, 2, 3, 4, 5, 6], b: [1, 2, 3, 7, 8, 9], expected: 3 },
            { a: [1, 2, 3, 4, 5, 6], b: [7, 8, 9, 10, 11, 12], expected: 0 },
        ])('$a vs $b → $expected', ({ a, b, expected }) => {
            const lottoA = Lotto.of(a);
            const lottoB = Lotto.of(b);
            expect(lottoA.getMatchCount(lottoB)).toBe(expected);
        });
    });
});

describe('getNumbers() 테스트', () => {
    describe('오름차순으로 정렬되어 있는 numbers 배열을 반환한다.', () => {
        it.each([
            { numbers: [6, 5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5, 6] },
            { numbers: [6, 1, 5, 3, 2, 4], expected: [1, 2, 3, 4, 5, 6] },
            {
                numbers: [45, 11, 21, 30, 22, 44],
                expected: [11, 21, 22, 30, 44, 45],
            },
        ])('$numbers', ({ numbers, expected }) => {
            const lotto = new Lotto(numbers);
            expect(lotto.getNumbers()).toEqual(expected);
        });
    });
});
