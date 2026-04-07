import { convertToMatchingDataType } from '../converter.js';

export default class PurchaseView {
    #$container = document.querySelector('#main-container');

    renderForm() {
        this.#$container.insertAdjacentHTML('beforeend', `
            <form id="input-price-form" class="mt-5" aria-labelledby="input-price">
                <label for="input-price" class="mb-2 d-inline-block">구입할 금액을 입력해주세요.</label>
                <div class="d-flex">
                    <input
                        type="number"
                        id="input-price"
                        class="w-100 mr-2 pl-2"
                        name="price"
                        placeholder="구입 금액"
                        required
                        min="1000"
                        max="100000"
                    />
                    <button type="submit" id="input-price-button" class="btn btn-cyan">확인</button>
                </div>
            </form>
        `);
    }

    #getUserInput() {
        const input = document.querySelector('#input-price').value;
        const price = convertToMatchingDataType(input);
        return { price };
    }

    onSubmit(handler) {
        const $formElement = document.querySelector('#input-price-form');

        $formElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userInput = this.#getUserInput();
            await handler(userInput);
        });
    }

    renderResult(data) {
        const { issuedCount, issuedLottosNumbers } = data;

        const issuedLottos = issuedLottosNumbers
            .map(
                (lottoNumbers) => `
                    <div class="lotto-item d-flex flex-row my-2">
                        <div class="lotto-icon mx-1 text-4xl">🎟️</div>
                        <div class="lotto-numbers none text-base mt-2">${lottoNumbers.join(', ')}</div>
                    </div>
                `,
            )
            .join('');

        this.#$container.insertAdjacentHTML('beforeend', `
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
                    ${issuedLottos}
                </div>
            </section>
        `);

        this.#setToggleLottoNumbers();
    }

    #setToggleLottoNumbers() {
        const $lottoSwitchButton = document.querySelector('#lotto-switch-button');

        $lottoSwitchButton.addEventListener('change', (event) => {
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
