import LottoBroadCast from '../../../src/js/domain/models/service/LottoBroadcast/index.js';
import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';
import LottoNumber from '../../../src/js/domain/models/entities/LottoNumber/LottoNumber.js';
import WinningLotto from '../../../src/js/domain/models/entities/WinningLotto/WinningLotto.js';

const { setWinnerLottoNumbers, setBonusNumber } = LottoBroadCast;

describe('setWinnerLottoNumbers(lottoNumbers) 테스트', () => {
    describe('lottoNumbers를 numbers로 가지는 Lotto 인스턴스를 반환한다.', () => {
        it.each([
            {
                lottoNumbers: [1, 2, 3, 4, 5, 6],
                expected: Lotto.of([1, 2, 3, 4, 5, 6]),
            },
            {
                lottoNumbers: [1, 12, 13, 14, 15, 16],
                expected: Lotto.of([1, 12, 13, 14, 15, 16]),
            },
            {
                lottoNumbers: [45, 44, 43, 42, 41, 40],
                expected: Lotto.of([45, 44, 43, 42, 41, 40]),
            },
        ])('$lottoNumbers', ({ lottoNumbers, expected }) => {
            const winnerLotto = setWinnerLottoNumbers(lottoNumbers);
            expect(winnerLotto).toEqual(expected);
        });
    });
});

describe('setBonusNumber(lotto, bonusNumber) 테스트', () => {
    describe('lotto와 bonueNumber를 각각 lotto와 bonusNumber로 가지는 WinningLotto 인스턴스를 반환한다.', () => {
        it.each([
            {
                winningLottoNumbers: [1, 2, 3, 4, 5, 6],
                bonusNumber: 45,
                expected: WinningLotto.from(
                    Lotto.of([1, 2, 3, 4, 5, 6]),
                    LottoNumber.of(45),
                ),
            },
            {
                winningLottoNumbers: [1, 2, 3, 4, 5, 6],
                bonusNumber: 45,
                expected: WinningLotto.from(
                    Lotto.of([1, 2, 3, 4, 5, 6]),
                    LottoNumber.of(45),
                ),
            },
        ])(
            'winningLottoNumbers: $winningLottoNumbers, bonusNumber: $bonusNumber',
            ({ winningLottoNumbers, bonusNumber, expected }) => {
                const lotto = Lotto.of(winningLottoNumbers);
                const winningInfo = setBonusNumber(lotto, bonusNumber);
                expect(winningInfo).toEqual(expected);
            },
        );
    });
});
