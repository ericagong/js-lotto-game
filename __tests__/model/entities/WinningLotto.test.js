import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';
import WinningLotto from '../../../src/js/domain/models/entities/WinningLotto/WinningLotto.js';
import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import {
    LottoNotLottoInstanceError,
    BonusNumberNotLottoNumberInstanceError,
    BonusNumberDuplicatedError,
} from '../../../src/js/domain/models/entities/WinningLotto/errors.js';

describe('static from(lotto, bonusNumber) 테스트', () => {
    it('WinningLotto 인스턴스를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = LottoNumber.of(45);
        const winningLotto = WinningLotto.from(lotto, bonusNumber);
        expect(winningLotto).toEqual(new WinningLotto(lotto, bonusNumber));
    });
});

describe('new WinningLotto(lotto, bonusNumber) 테스트', () => {
    describe('lotto가 Lotto 인스턴스 타입이 아니면, 에러를 발생시킨다.', () => {
        it.each([
            1,
            '1',
            'erica',
            true,
            null,
            undefined,
            function () {},
            {},
            [],
        ])('lotto: %p', (lotto) => {
            expect(() => new WinningLotto(lotto, LottoNumber.of(45))).toThrow(
                LottoNotLottoInstanceError,
            );
        });
    });

    describe('bonusNumber가 LottoNumber 인스턴스 타입이 아니면, 에러를 발생시킨다.', () => {
        it.each([
            1,
            '1',
            'erica',
            true,
            null,
            undefined,
            function () {},
            {},
            [],
        ])('bonusNumber: %p', (bonusNumber) => {
            const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
            expect(() => new WinningLotto(lotto, bonusNumber)).toThrow(
                BonusNumberNotLottoNumberInstanceError,
            );
        });
    });

    describe('bonusNumber가 winningtargetLottoNumbers[1, 2, 3, 4, 5, 6]와 중복되면, 에러를 발생시킨다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        it.each([1, 2, 3, 4, 5, 6])('bonusNumber: %p', (bonusNumber) => {
            expect(
                () => new WinningLotto(lotto, LottoNumber.of(bonusNumber)),
            ).toThrow(BonusNumberDuplicatedError);
        });
    });

    it('Lotto 인스턴스인 lotto와 중복되지 않는 bonusNumber 인스턴스를 받으면, 에러를 발생시키지 않는다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        expect(() => new WinningLotto(lotto, LottoNumber.of(45))).not.toThrow();
    });
});

describe('matchBonusNumber(targetLotto) 테스트', () => {
    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
    const bonusNumber = LottoNumber.of(45);
    const winningLotto = WinningLotto.from(lotto, bonusNumber);

    describe('targetLotto가 Lotto 인스턴스 타입이 아니면, 에러를 발생시킨다.', () => {
        it.each([
            1,
            '1',
            'erica',
            true,
            null,
            undefined,
            function () {},
            {},
            [],
        ])('targetLotto: %p', (targetLotto) => {
            expect(() => winningLotto.matchBonusNumber(targetLotto)).toThrow(
                LottoNotLottoInstanceError,
            );
        });
    });

    it('targetLotto의 번호 중 하나가 보너스 번호와 일치하면, true를 반환한다.', () => {
        const targetLotto = Lotto.of([1, 2, 3, 4, 5, 45]);
        expect(winningLotto.matchBonusNumber(targetLotto)).toBe(true);
    });

    it('targetLotto의 번호가 모두 보너스 번호와 일치하지 않으면, false를 반환한다.', () => {
        const targetLotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        expect(winningLotto.matchBonusNumber(targetLotto)).toBe(false);
    });
});

describe('getMatchCount(targetLotto) 테스트', () => {
    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
    const winningLotto = WinningLotto.from(lotto, LottoNumber.of(45));

    describe('targetLotto가 Lotto 인스턴스 타입이 아니면, 에러를 발생시킨다.', () => {
        it.each([
            1,
            '1',
            'erica',
            true,
            null,
            undefined,
            function () {},
            {},
            [],
        ])('targetLotto: %p', (targetLotto) => {
            expect(() => winningLotto.getMatchCount(targetLotto)).toThrow(
                LottoNotLottoInstanceError,
            );
        });
    });

    describe('targetLotto의 로또 번호와 winnningLotto의 lotto 번호가 일치하는 개수를 반환한다.', () => {
        it.each([
            { targetLottoNumbers: [1, 2, 3, 4, 5, 6], expected: 6 },
            { targetLottoNumbers: [1, 2, 3, 4, 5, 7], expected: 5 },
            { targetLottoNumbers: [1, 2, 3, 4, 7, 8], expected: 4 },
            { targetLottoNumbers: [1, 2, 3, 7, 8, 9], expected: 3 },
            { targetLottoNumbers: [1, 2, 7, 8, 9, 10], expected: 2 },
            { targetLottoNumbers: [1, 7, 8, 9, 10, 11], expected: 1 },
            { targetLottoNumbers: [7, 8, 9, 10, 11, 12], expected: 0 },
        ])(
            'targetLottoNumbers: $targetLottoNumbers, expected: $expected',
            ({ targetLottoNumbers, expected }) => {
                const targetLotto = Lotto.of(targetLottoNumbers);
                expect(winningLotto.getMatchCount(targetLotto)).toBe(expected);
            },
        );
    });
});
