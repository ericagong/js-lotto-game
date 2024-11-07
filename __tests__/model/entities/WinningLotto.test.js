import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';
import WinningLotto from '../../../src/js/domain/models/entities/WinningLotto/WinningLotto.js';
import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import {
    LottoNotLottoInstanceError,
    BonusNumberNotLottoNumberInstanceError,
    BonusNumberDuplicatedError,
} from '../../../src/js/domain/models/entities/WinningLotto/errors.js';
import Rank from '../../../src/js/domain/models/entities/Rank/Rank.js';

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

describe('getRank(targetLotto) 테스트', () => {
    describe('targetLotto 번호와 winningLotto 번호([1, 2, 3, 4, 5, 6], 7)를 비교해, Rank 객체를 반환한다.', () => {
        it.each([
            {
                targetLottoNumbers: [1, 2, 3, 4, 5, 6],
                expected: Rank.FIRST,
            },
            {
                targetLottoNumbers: [1, 2, 3, 4, 5, 7],
                expected: Rank.SECOND,
            },
            { targetLottoNumbers: [1, 2, 3, 4, 5, 45], expected: Rank.THIRD },
            { targetLottoNumbers: [1, 2, 3, 4, 44, 45], expected: Rank.FOURTH },
            { targetLottoNumbers: [1, 2, 3, 43, 44, 45], expected: Rank.FIFTH },
            { targetLottoNumbers: [1, 2, 42, 43, 44, 45], expected: Rank.NONE },
            {
                targetLottoNumbers: [1, 41, 42, 43, 44, 45],
                expected: Rank.NONE,
            },
            {
                targetLottoNumbers: [40, 41, 42, 43, 44, 45],
                expected: Rank.NONE,
            },
        ])(
            'targetLottoNumbers: $targetLottoNumbers, ',
            ({ targetLottoNumbers, expected }) => {
                const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
                const bonusLottoNumber = LottoNumber.of(7);
                const winningLotto = WinningLotto.from(lotto, bonusLottoNumber);
                const targetLotto = Lotto.of(targetLottoNumbers);
                expect(winningLotto.getRank(targetLotto, winningLotto)).toEqual(
                    expected,
                );
            },
        );
    });
});
