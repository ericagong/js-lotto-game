import Lotto from '../src/js/domain/models/Lotto/Lotto.js';
import BonusNumber from '../src/js/domain/models/BonusNumber/BonusNumber.js';
import WinningLotto from '../src/js/domain/models/WinningLotto/WinningLotto.js';
import {
    NotLottoInstanceError,
    NotBonusNumberInstanceError,
} from '../src/js/domain/models/WinningLotto/errors.js';
import Rank from '../src/js/domain/models/Rank/Rank.js';

describe('WinningLotto 생성자 테스트', () => {
    describe('lotto가 Lotto 인스턴스가 아니면, 에러를 발생시킨다.', () => {
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
            expect(() => new WinningLotto(lotto, 45)).toThrow(
                NotLottoInstanceError,
            );
        });
    });

    describe('bonusNumber가 BonusNumber 인스턴스가 아니면, 에러를 발생시킨다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
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
            expect(() => new WinningLotto(lotto, bonusNumber)).toThrow(
                NotBonusNumberInstanceError,
            );
        });
    });

    it('인자로 Lotto와 BonusNumber 인스턴스를 받으면, 에러를 발생시키지 않는다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = BonusNumber.from(45, lotto);
        expect(() => new WinningLotto(lotto, bonusNumber)).not.toThrow();
    });
});

describe('static from(lotto, bonusNumber) 테스트', () => {
    it('WinningLotto 인스턴스를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = BonusNumber.from(45, lotto);
        const winningLotto = WinningLotto.from(lotto, bonusNumber);
        expect(winningLotto).toBeInstanceOf(WinningLotto);
    });
});

describe('checkRank(targetLotto) 테스트', () => {
    describe('올바른 Rank 객체를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = BonusNumber.from(7, lotto);
        const winningLotto = new WinningLotto(lotto, bonusNumber);
        const testCases = [
            {
                lottoNumbers: [1, 2, 3, 4, 5, 6],
                rank: 1,
            },
            {
                lottoNumbers: [1, 2, 3, 4, 5, 7],
                rank: 2,
            },
            {
                lottoNumbers: [1, 2, 3, 4, 5, 16],
                rank: 3,
            },
            {
                lottoNumbers: [1, 2, 3, 4, 15, 16],
                rank: 4,
            },
            {
                lottoNumbers: [1, 2, 3, 4, 15, 7],
                rank: 4,
            },
            {
                lottoNumbers: [1, 2, 3, 14, 15, 16],
                rank: 5,
            },
            {
                lottoNumbers: [1, 2, 3, 14, 15, 7],
                rank: 5,
            },
            {
                lottoNumbers: [1, 2, 13, 14, 15, 16],
                rank: 6,
            },
            {
                lottoNumbers: [1, 2, 13, 14, 15, 7],
                rank: 6,
            },
            {
                lottoNumbers: [1, 12, 13, 14, 15, 16],
                rank: 6,
            },
            {
                lottoNumbers: [1, 12, 13, 14, 15, 7],
                rank: 6,
            },
            {
                lottoNumbers: [11, 12, 13, 14, 15, 16],
                rank: 6,
            },
            {
                lottoNumbers: [11, 12, 13, 14, 15, 7],
                rank: 6,
            },
        ];

        it.each(testCases)(
            'lottoNumbers: $lottoNumbers, rank: $rank',
            ({ lottoNumbers, rank }) => {
                const targetLotto = Lotto.of(lottoNumbers);
                const expectedRank = Rank.of(rank);
                expect(winningLotto.getRank(targetLotto)).toEqual(expectedRank);
            },
        );
    });
});
