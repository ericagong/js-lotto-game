import Lotto from '../../src/js/domain/models/Lotto/Lotto.js';
import {
    LottoNumbersNotArrayError,
    LottoNumbersLengthNotSixError,
    LottoNumberDuplicatedError,
} from '../../src/js/domain/models/Lotto/errors.js';

describe('Lotto 생성자 테스트', () => {
    describe('LottoNumbers 유효성 검사 테스트', () => {
        describe('배열 형태가 아니면, 에러를 발생시킨다.', () => {
            it.each([1, 'erica', true, null, undefined, function () {}, {}])(
                '%p',
                (lottoNumbers) => {
                    expect(() => new Lotto(lottoNumbers)).toThrow(
                        LottoNumbersNotArrayError,
                    );
                },
            );
        });

        describe('배열 길이가 6이 아니라면, 에러를 발생시킨다.', () => {
            it.each([
                { lottoNumbers: [] },
                { lottoNumbers: [1, 2, 3, 4, 5] },
                { lottoNumbers: [1, 2, 3, 4, 5, 6, 7] },
            ])('$lottoNumbers', ({ lottoNumbers }) => {
                expect(() => new Lotto(lottoNumbers)).toThrow(
                    LottoNumbersLengthNotSixError,
                );
            });
        });

        describe('요소 중 중복된 숫자가 있다면, 에러를 발생시킨다.', () => {
            it.each([
                { lottoNumbers: [1, 1, 1, 1, 1, 1] },
                { lottoNumbers: [1, 2, 3, 4, 5, 5] },
                { lottoNumbers: [1, 2, 3, 4, 5, 1] },
            ])('$lottoNumbers', ({ lottoNumbers }) => {
                expect(() => new Lotto(lottoNumbers)).toThrow(
                    LottoNumberDuplicatedError,
                );
            });
        });

        describe('유효하면, 에러를 발생시키지 않는다.', () => {
            it.each([
                { lottoNumbers: [1, 2, 3, 4, 5, 6] },
                { lottoNumbers: [1, 2, 3, 4, 5, 45] },
            ])('$lottoNumbers', ({ lottoNumbers }) => {
                expect(() => new Lotto(lottoNumbers)).not.toThrow();
            });
        });
    });

    describe('LottoNumbers 정렬 테스트', () => {
        it.each([
            { lottoNumbers: [6, 5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5, 6] },
            { lottoNumbers: [6, 1, 5, 3, 2, 4], expected: [1, 2, 3, 4, 5, 6] },
            {
                lottoNumbers: [45, 11, 21, 30, 22, 44],
                expected: [11, 21, 22, 30, 44, 45],
            },
        ])('$lottoNumbers', ({ lottoNumbers, expected }) => {
            const lotto = new Lotto(lottoNumbers);
            expect(lotto.getLottoNumbers()).toEqual(expected);
        });
    });
});

describe('static of() 테스트', () => {
    it('Lotto 인스턴스를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        expect(lotto).toBeInstanceOf(Lotto);
    });
});

describe('getLottoNumbers() 테스트', () => {
    describe('lottoNumbers를 오름차순 정렬 숫자 배열 형태로 반환한다.', () => {
        it.each([
            { lottoNumbers: [6, 5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5, 6] },
            { lottoNumbers: [6, 1, 5, 3, 2, 4], expected: [1, 2, 3, 4, 5, 6] },
            {
                lottoNumbers: [45, 11, 21, 30, 22, 44],
                expected: [11, 21, 22, 30, 44, 45],
            },
        ])('$lottoNumbers', ({ lottoNumbers, expected }) => {
            const lotto = new Lotto(lottoNumbers);
            expect(lotto.getLottoNumbers()).toEqual(expected);
        });
    });
});
