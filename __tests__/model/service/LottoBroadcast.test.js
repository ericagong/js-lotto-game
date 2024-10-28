import LottoBroadCast from '../../../src/js/domain/models/service/LottoBroadcast/index.js';
import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';
import WinningLotto from '../../../src/js/domain/models/entities/WinningLotto/WinningLotto.js';

const { setWinnerLottoNumbers, setBonusNumber } = LottoBroadCast;

describe('setWinnerLottoNumbers(winningLottoNumbers) 테스트', () => {
    describe('winningLottoNumbers를 numbers로 가지는 Lotto 인스턴스를 반환한다.', () => {
        it.each([
            {
                winningLottoNumbers: [1, 2, 3, 4, 5, 6],
                expected: Lotto.of([1, 2, 3, 4, 5, 6]),
            },
            {
                winningLottoNumbers: [1, 12, 13, 14, 15, 16],
                expected: Lotto.of([1, 12, 13, 14, 15, 16]),
            },
            {
                winningLottoNumbers: [45, 44, 43, 42, 41, 40],
                expected: Lotto.of([45, 44, 43, 42, 41, 40]),
            },
        ])('$winningLottoNumbers', ({ winningLottoNumbers, expected }) => {
            const winnerLotto = setWinnerLottoNumbers(winningLottoNumbers);
            expect(winnerLotto).toEqual(expected);
        });
    });
});

describe('setBonusNumber(baseWinningLotto, bonusNumber) 테스트', () => {
    describe('baseWinningLotto와 bonueNumber를 각각 lotto와 bonusNumber로 가지는 WinningLotto 인스턴스를 반환한다.', () => {
        it.each([
            {
                winningLotto: Lotto.of([1, 2, 3, 4, 5, 6]),
                bonusNumber: 7,
                expected: WinningLotto.from(Lotto.of([1, 2, 3, 4, 5, 6]), 7),
            },
            {
                winningLotto: Lotto.of([1, 2, 3, 4, 5, 6]),
                bonusNumber: 45,
                expected: WinningLotto.from(Lotto.of([1, 2, 3, 4, 5, 6]), 45),
            },
        ])(
            'winningLotto: $winningLotto, bonusNumber: $bonusNumber',
            ({ winningLotto, bonusNumber, expected }) => {
                const winningInfo = setBonusNumber(winningLotto, bonusNumber);
                expect(winningInfo).toEqual(expected);
            },
        );
    });
});
