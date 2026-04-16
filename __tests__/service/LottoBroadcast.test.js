import LottoBroadcast from '../../src/js/domain/service/LottoBroadcast/LottoBroadcast.js';
import WinningLotto from '../../src/js/domain/entity/WinningLotto/WinningLotto.js';
import { NumbersInvalidLengthError } from '../../src/js/domain/entity/Lotto/errors.js';
import { ValueOutOfRangeError } from '../../src/js/domain/entity/LottoNumber/errors.js';
import { BonusNumberDuplicatedError } from '../../src/js/domain/entity/WinningLotto/errors.js';

describe('static announce(numbers, bonusNumber) 테스트', () => {
    it('유효한 당첨 번호와 보너스 번호로 WinningLotto 인스턴스를 반환한다.', () => {
        const winningLotto = LottoBroadcast.announce([1, 2, 3, 4, 5, 6], 7);
        expect(winningLotto).toBeInstanceOf(WinningLotto);
    });

    it('당첨 번호가 6개가 아니면, 에러를 발생시킨다.', () => {
        expect(() => LottoBroadcast.announce([1, 2, 3], 7)).toThrow(NumbersInvalidLengthError);
    });

    it('보너스 번호가 [1, 45] 범위 밖이면, 에러를 발생시킨다.', () => {
        expect(() => LottoBroadcast.announce([1, 2, 3, 4, 5, 6], 46)).toThrow(ValueOutOfRangeError);
    });

    it('보너스 번호가 당첨 번호와 중복되면, 에러를 발생시킨다.', () => {
        expect(() => LottoBroadcast.announce([1, 2, 3, 4, 5, 6], 6)).toThrow(BonusNumberDuplicatedError);
    });
});
