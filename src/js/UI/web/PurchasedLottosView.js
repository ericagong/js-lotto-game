export default class PurchasedLottosView {
    #$container = document.querySelector('#main-container');

    constructor({ issuedCount, issuedLottosNumbers }) {
        this.#render({ issuedCount, issuedLottosNumbers });
        this.#bindToggle();
    }

    #render({ issuedCount, issuedLottosNumbers }) {
        const lottoItems = issuedLottosNumbers
            .map(
                (lottoNumbers) => `
                    <div class="lotto-item d-flex flex-row my-2">
                        <div class="lotto-icon mx-1 text-4xl">🎟️</div>
                        <div class="lotto-numbers none text-base mt-2">${lottoNumbers.join(', ')}</div>
                    </div>
                `,
            )
            .join('');

        this.#$container.insertAdjacentHTML(
            'beforeend',
            `
            <section id="purchased-lottos-section" class="mt-9" aria-label="purchase-items">
                <div class="d-flex">
                    <label class="flex-auto my-0">
                        총
                        <span id="total-purchased">${issuedCount}</span>
                        개를 구매하였습니다
                    </label>
                    <div class="flex-auto d-flex justify-end pr-1">
                        <label class="switch">
                            <input
                                id="lotto-switch-button"
                                type="checkbox"
                                class="lotto-numbers-toggle-button"
                            />
                            <span class="text-base font-normal">번호보기</span>
                        </label>
                    </div>
                </div>
                <div class="d-flex flex-wrap" id="lottos-container">
                    ${lottoItems}
                </div>
            </section>
        `,
        );
    }

    #bindToggle() {
        document.querySelector('#lotto-switch-button').addEventListener('change', (event) => {
            const showNumbers = event.target.checked;

            document.querySelectorAll('.lotto-item').forEach(($item) => {
                $item.classList.toggle('w-100', showNumbers);
            });

            document.querySelectorAll('.lotto-numbers').forEach(($number) => {
                $number.classList.toggle('none', !showNumbers);
            });
        });
    }
}
