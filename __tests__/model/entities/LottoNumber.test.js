import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import {
    ValueNotNumberError,
    ValueNotIntegerError,
    ValueOutOfRangeError,
} from '../../../src/js/domain/models/entities/LottoNumber/errors.js';

describe('static of(value) 테스트', () => {
    it('LottoNumber 인스턴스를 반환한다.', () => {
        const value = 1;
        expect(LottoNumber.of(value)).toEqual(new LottoNumber(value));
    });
});

describe('new LottoNumber(value)', () => {
    describe('value 유효성 검사 테스트', () => {
        describe('value가 유효한 형태가 아니면, 에러를 발생시킨다.', () => {
            describe('Number 타입이 아닌 경우', () => {
                it.each([
                    'erica',
                    ' ',
                    '',
                    '1',
                    true,
                    null,
                    undefined,
                    function () {},
                    {},
                ])('%p', (value) => {
                    expect(() => new LottoNumber(value)).toThrow(
                        ValueNotNumberError,
                    );
                });
            });

            describe('정수 형태가 아닌 경우', () => {
                it.each([0.1, 0.9, 1.1, 1.9, 44.1, 44.9, 45.1, 45.9])(
                    '%p',
                    (value) => {
                        expect(() => new LottoNumber(value)).toThrow(
                            ValueNotIntegerError,
                        );
                    },
                );
            });

            describe('[1, 45] 사이 값이 아닌 경우', () => {
                it.each([-1, 0, 46])('%p', (value) => {
                    expect(() => new LottoNumber(value)).toThrow(
                        ValueOutOfRangeError,
                    );
                });
            });
        });

        describe('[1, 45] 사이 정수 형태의 Number 타입이라면, 에러를 발생시키지 않는다.', () => {
            it.each([1, 1.0, 45, 45.0, 45.0])('%p', (value) => {
                expect(() => new LottoNumber(value)).not.toThrow();
            });
        });
    });
});

describe('get value 테스트', () => {
    describe('value를 반환한다.', () => {
        it.each([
            { value: 1, expected: 1 },
            { value: 45, expected: 45 },
        ])('value: $value', ({ value, expected }) => {
            const lottoNumber = LottoNumber.of(value);
            expect(lottoNumber.value).toBe(expected);
        });
    });
});
