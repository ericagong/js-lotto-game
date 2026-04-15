import Budget from '../../src/js/domain/entity/Budget/Budget.js';
import Lotto from '../../src/js/domain/entity/Lotto/Lotto.js';
import Lottos from '../../src/js/domain/collection/Lottos/Lottos.js';

describe('static of(numbersList) 테스트', () => {
    it('각 numbers를 Lotto로 감싸 Lottos 인스턴스를 반환한다.', () => {
        const numbersList = [
            [1, 2, 3, 4, 5, 6],
            [10, 11, 12, 13, 14, 15],
        ];
        const lottos = Lottos.of(numbersList);
        expect(lottos).toBeInstanceOf(Lottos);
        expect(lottos.count).toBe(2);
        expect(lottos.snapshot).toEqual(numbersList);
    });
});
