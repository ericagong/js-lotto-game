import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import {
    NotNumberError,
    NotIntegerError,
    OutOfRangeError,
} from '../../../src/js/domain/models/entities/LottoNumber/errors.js';

// lottoNumber 인덱스로 변경
describe('static of(number) 테스트', () => {
    it('LottoNumber 인스턴스를 반환한다.', () => {
        const number = 1;
        expect(LottoNumber.of(number)).toEqual(new LottoNumber(number));
    });
});

describe('new LottoNumber(number)', () => {
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
            ])('%p', (number) => {
                expect(() => new LottoNumber(number)).toThrow(NotNumberError);
            });
        });

        describe('정수가 아니면 에러를 발생시킨다.', () => {
            it.each([0.1, 0.9, 1.1, 1.9, 44.1, 44.9, 45.1, 45.9])(
                '%p',
                (number) => {
                    expect(() => new LottoNumber(number)).toThrow(
                        NotIntegerError,
                    );
                },
            );
        });

        describe('[1, 45]를 벗어나면, 에러를 발생시킨다.', () => {
            it.each([-1, 0, 46])('%p', (number) => {
                expect(() => new LottoNumber(number)).toThrow(OutOfRangeError);
            });
        });

        describe('[1, 45] 사이 정수라면, 에러를 발생시키지 않는다.', () => {
            it.each([1, 1.0, 45, 45.0, 45.0])('%p', (number) => {
                expect(() => new LottoNumber(number)).not.toThrow();
            });
        });
    });
});

describe('get number 테스트', () => {
    describe('number를 반환한다.', () => {
        it.each([
            { number: 1, expected: 1 },
            { number: 45, expected: 45 },
        ])('%p', ({ number, expected }) => {
            const lottoNumber = LottoNumber.of(number);
            expect(lottoNumber.number).toBe(expected);
        });
    });
});
