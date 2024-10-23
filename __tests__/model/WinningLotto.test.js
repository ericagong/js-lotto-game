import Lotto from '../../src/js/domain/models/Lotto/Lotto.js';
import WinningLotto from '../../src/js/domain/models/WinningLotto/WinningLotto.js';
import {
    NotLottoInstanceError,
    DuplicatedError,
} from '../../src/js/domain/models/WinningLotto/errors.js';

describe('static from(lotto, bonusNumber) 테스트', () => {
    it('WinningLotto 인스턴스를 반환한다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        const bonusNumber = 45;
        const winningLotto = WinningLotto.from(lotto, bonusNumber);
        expect(winningLotto).toEqual(new WinningLotto(lotto, bonusNumber));
    });
});

describe('new WinningLotto(lotto, bonusNumber) 테스트', () => {
    describe('lotto 유효성 테스트', () => {
        describe('Lotto 인스턴스가 아니면, 에러를 발생시킨다.', () => {
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
    });

    describe('bonusNumber 유효성 테스트', () => {
        describe('bonusNumber가 winningLottoNumbers[1, 2, 3, 4, 5, 6]와 중복되면, 에러를 발생시킨다.', () => {
            const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
            it.each([1, 2, 3, 4, 5, 6])('bonusNumber: %p', (bonusNumber) => {
                expect(() => new WinningLotto(lotto, bonusNumber)).toThrow(
                    DuplicatedError,
                );
            });
        });
    });

    it('Lotto 인스턴스인 lotto와 [1, 45] 사이의 중복되지 않는 bonusNumber를 받으면, 에러를 발생시키지 않는다.', () => {
        const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
        expect(() => new WinningLotto(lotto, 45)).not.toThrow();
    });
});

describe('getIsBonusMatch(targetNumbers) 테스트', () => {
    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
    const winningLotto = WinningLotto.from(lotto, 45);

    it('보너스 번호가 일치하면, true를 반환한다.', () => {
        const targetNumbers = [1, 2, 3, 4, 5, 45];
        expect(winningLotto.getIsBonusMatch(targetNumbers)).toBe(true);
    });

    it('보너스 번호가 일치하지 않으면, false를 반환한다.', () => {
        const targetNumbers = [1, 2, 3, 4, 5, 6];
        expect(winningLotto.getIsBonusMatch(targetNumbers)).toBe(false);
    });
});

describe('getMatchCount(targetNumbers) 테스트', () => {
    const lotto = Lotto.of([1, 2, 3, 4, 5, 6]);
    const winningLotto = WinningLotto.from(lotto, 45);

    describe('일치하는 번호 개수를 반환한다.', () => {
        it.each([
            { lottoNumbers: [1, 2, 3, 4, 5, 6], expected: 6 },
            { lottoNumbers: [1, 2, 3, 4, 5, 7], expected: 5 },
            { lottoNumbers: [1, 2, 3, 4, 7, 8], expected: 4 },
            { lottoNumbers: [1, 2, 3, 7, 8, 9], expected: 3 },
            { lottoNumbers: [1, 2, 7, 8, 9, 10], expected: 2 },
            { lottoNumbers: [1, 7, 8, 9, 10, 11], expected: 1 },
            { lottoNumbers: [7, 8, 9, 10, 11, 12], expected: 0 },
        ])(
            'lottoNumbers: $lottoNumbers, expected: $expected',
            ({ lottoNumbers, expected }) => {
                expect(winningLotto.getMatchCount(lottoNumbers)).toBe(expected);
            },
        );
    });
});
