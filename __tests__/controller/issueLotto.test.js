import issueLotto from '../../src/js/controller/issueLotto.js';
import Lotto from '../../src/js/domain/models/Lotto/Lotto.js';

// [ ] Question 의미 없는 테스트 = 제거?
describe('issueLotto() 테스트', () => {
    it('Lotto 객체를 반환한다.', () => {
        const lotto = issueLotto();
        expect(lotto).toBeInstanceOf(Lotto);
    });
});
