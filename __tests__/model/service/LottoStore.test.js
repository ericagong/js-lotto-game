import LottoStore from '../../../src/js/domain/models/service/LottoStore/index.js';
import Lotto from '../../../src/js/domain/models/entities/Lotto/Lotto.js';

const { getIssueCount, issueLotto } = LottoStore;

describe('getIssueCount(budget) 테스트', () => {
    describe('주어진 budget 내에서 발행할 수 있는 로또 최대 개수를 반환한다.', () => {
        it.each([
            { budget: 1000, expected: 1 },
            { budget: 10_000, expected: 10 },
            { budget: 100_000, expected: 100 },
        ])('budget: $budget, count: $expected', ({ budget, expected }) => {
            const lottoCount = getIssueCount(budget);
            expect(lottoCount).toBe(expected);
        });
    });
});
describe('issueLotto() 테스트', () => {
    it('Lotto 객체를 반환한다.', () => {
        const lotto = issueLotto();
        expect(lotto).toBeInstanceOf(Lotto);
    });
});
