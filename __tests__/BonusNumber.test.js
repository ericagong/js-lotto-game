import BonusNumber from '../src/js/domain/models/BonusNumber/BonusNumber.js';
import Lotto from '../src/js/domain/models/Lotto/Lotto.js';
import {
    LottoNumberNotNumberError,
    LottoNumberNotIntegerError,
    LottoNumberOutOfRangeError,
} from '../src/js/domain/models/LottoNumber/errors.js';
import {
    BonusNumberDuplicatedError,
    NotLottoInstanceError,
} from '../src/js/domain/models/BonusNumber/errors.js';

// QUESTION(TODO) 필요한 테스트인지? 이미 LottoNumber에서 테스트가 완료된 부분을 중복 검사하는건 아닌지? 테스트 검증의 필요성이 있는지?
describe('BonusNumber 생성자 테스트', () => {
    describe('BonusNumber 유효성 검사 테스트', () => {
        describe('LottoNumber 유효성 검사', () => {
            const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);

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
                ])('$bonusNumber', (bonusNumber) => {
                    expect(() => new BonusNumber(bonusNumber, lotto)).toThrow(
                        LottoNumberNotNumberError,
                    );
                });
            });

            describe('정수가 아니면 에러를 발생시킨다.', () => {
                it.each([0.1, 0.9, 1.1, 1.9, 44.1, 44.9, 45.1, 45.9])(
                    '$bonusNumber',
                    (bonusNumber) => {
                        expect(
                            () => new BonusNumber(bonusNumber, lotto),
                        ).toThrow(LottoNumberNotIntegerError);
                    },
                );
            });

            describe('[1, 45]를 벗어나면, 에러를 발생시킨다.', () => {
                it.each([-1, 0, 46])('$bonusNumber', (bonusNumber) => {
                    expect(() => new BonusNumber(bonusNumber, lotto)).toThrow(
                        LottoNumberOutOfRangeError,
                    );
                });
            });

            describe('[1, 45] 사이 정수라면, 에러를 발생시키지 않는다.', () => {
                it.each([45, 45.0])('$bonusNumber', (bonusNumber) => {
                    expect(
                        () => new BonusNumber(bonusNumber, lotto),
                    ).not.toThrow();
                });
            });
        });

        describe('lottoNumbers 유효성 검사', () => {
            describe('lotto가 Lotto 인스턴스가 아니면, 에러를 발생시킨다.', () => {
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
                ])('$lotto', (lotto) => {
                    const bonusNumber = 45;
                    expect(() => new BonusNumber(bonusNumber, lotto)).toThrow(
                        NotLottoInstanceError,
                    );
                });
            });
        });

        describe('BonusNumber 유효성 검사', () => {
            describe('당첨 로또 번호들과 보너스 번호가 중복되면, 에러를 발생시킨다.', () => {
                it.each([
                    {
                        lottoNumbers: [1, 2, 3, 4, 5, 6],
                        bonusNumber: 1,
                    },
                    {
                        lottoNumbers: [1, 2, 3, 4, 5, 45],
                        bonusNumber: 45,
                    },
                    {
                        lottoNumbers: [1, 2, 3, 4, 5, 45],
                        bonusNumber: 45.0,
                    },
                ])(
                    '$lottoNumbers, $bonusNumber',
                    ({ lottoNumbers, bonusNumber }) => {
                        const lotto = Lotto.of(lottoNumbers);
                        expect(
                            () => new BonusNumber(bonusNumber, lotto),
                        ).toThrow(BonusNumberDuplicatedError);
                    },
                );
            });
        });
    });
});

describe('static of() 테스트', () => {
    it('BonusNumber 인스턴스를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = BonusNumber.from(45, lotto);
        expect(bonusNumber).toBeInstanceOf(BonusNumber);
        expect(bonusNumber.number).toBe(45);
    });
});

describe('get number 테스트', () => {
    it('BonusNumber를 숫자 형태로 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumberInstance = BonusNumber.from(45, lotto);
        expect(bonusNumberInstance.number).toBe(45);
    });
});
