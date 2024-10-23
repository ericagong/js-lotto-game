import Lotto from '../../src/js/domain/models/Lotto/Lotto.js';
import {
    NotArrayError,
    LengthNotSixError,
    DuplicatedError,
} from '../../src/js/domain/models/Lotto/errors.js';

describe('static of(lottoNumbers) 테스트', () => {
    it('Lotto 인스턴스를 반환한다.', () => {
        const lottoNumbers = [1, 2, 3, 4, 5, 6];
        const lotto = Lotto.of(lottoNumbers);
        expect(lotto).toEqual(new Lotto(lottoNumbers));
    });
});

describe('new Lotto(lottoNumbers) 테스트', () => {
    describe('lottoNumbers 유효성 검사 테스트', () => {
        describe('배열 형태가 아니면, 에러를 발생시킨다.', () => {
            it.each([1, 'erica', true, null, undefined, function () {}, {}])(
                'lottoNumbers: %p',
                (value) => {
                    expect(() => new Lotto(value)).toThrow(NotArrayError);
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
                    LengthNotSixError,
                );
            });
        });

        describe('로또 번호 중 중복된 숫자가 있다면, 에러를 발생시킨다.', () => {
            it.each([
                { lottoNumbers: [1, 1, 1, 1, 1, 1] },
                { lottoNumbers: [1, 2, 3, 4, 5, 5] },
                { lottoNumbers: [1, 2, 3, 4, 5, 1] },
            ])('$lottoNumbers', ({ lottoNumbers }) => {
                expect(() => new Lotto(lottoNumbers)).toThrow(DuplicatedError);
            });
        });

        describe('유효한 경우, 에러를 발생시키지 않는다.', () => {
            it.each([
                { lottoNumbers: [1, 2, 3, 4, 5, 6] },
                { lottoNumbers: [1, 2, 3, 4, 5, 45] },
            ])('$lottoNumbers', ({ lottoNumbers }) => {
                expect(() => new Lotto(lottoNumbers)).not.toThrow();
            });
        });
    });

    describe('lottoNumbers 정렬 테스트', () => {
        describe('오름차순으로 정렬되어 lottoNumbers로 저장된다.', () => {
            it.each([
                {
                    lottoNumbers: [6, 5, 4, 3, 2, 1],
                    expected: [1, 2, 3, 4, 5, 6],
                },
                {
                    lottoNumbers: [6, 1, 5, 3, 2, 4],
                    expected: [1, 2, 3, 4, 5, 6],
                },
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
});

describe('getLottoNumbers() 테스트', () => {
    describe('lottoNumbers를 number 배열 형태로 반환한다.', () => {
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
