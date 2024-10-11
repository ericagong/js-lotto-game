import LottoNumber from '../src/js/domain/models/LottoNumber/LottoNumber.js';
import {
    LottoNumberNotNumberError,
    LottoNumberNotIntegerError,
    LottoNumberOutOfRangeError,
} from '../src/js/domain/models/LottoNumber/errors.js';

describe('LottoNumber 생성자 테스트', () => {
    describe('LottoNumber 유효성 검사 테스트', () => {
        describe('숫자 타입이 아니면 에러를 발생시킨다.', () => {
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
            ])('$lottoNumber', (lottoNumber) => {
                expect(() => new LottoNumber(lottoNumber)).toThrow(
                    LottoNumberNotNumberError,
                );
            });
        });

        describe('정수가 아니면 에러를 발생시킨다.', () => {
            it.each([0.1, 0.9, 1.1, 1.9, 44.1, 44.9, 45.1, 45.9])(
                '$lottoNumber',
                (lottoNumber) => {
                    expect(() => new LottoNumber(lottoNumber)).toThrow(
                        LottoNumberNotIntegerError,
                    );
                },
            );
        });

        describe('[1, 45]를 벗어나면, 에러를 발생시킨다.', () => {
            it.each([-1, 0, 46])('$lottoNumber', (lottoNumber) => {
                expect(() => new LottoNumber(lottoNumber)).toThrow(
                    LottoNumberOutOfRangeError,
                );
            });
        });

        describe('[1, 45] 사이 정수라면, 에러를 발생시키지 않는다.', () => {
            it.each([1, 1.0, 45, 45.0, 45.0])('$lottoNumber', (lottoNumber) => {
                expect(() => new LottoNumber(lottoNumber)).not.toThrow();
            });
        });
    });
});

describe('of() 테스트', () => {
    it('LottoNumber 인스턴스를 반환한다.', () => {
        const lottoNumber = LottoNumber.of(1);
        expect(lottoNumber).toBeInstanceOf(LottoNumber);
    });
});

describe('getNumber() 테스트', () => {
    describe('LottoNumber를 숫자 형태로 반환한다.', () => {
        it.each([1, 45])('$lottoNumber', (lottoNumber) => {
            const lottoNumberInstance = LottoNumber.of(lottoNumber);
            expect(lottoNumberInstance.getNumber()).toBe(lottoNumber);
        });
    });
});
