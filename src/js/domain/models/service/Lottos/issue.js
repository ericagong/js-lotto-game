import LottoStore from '../../entities/LottoStore/LottoStore.js';

export default function issue(budget) {
    const lottoStore = LottoStore.of(budget);
    return lottoStore.getLottos();
}
