import { convertToMatchingDataType } from '../converter.js';

export default class WinningNumberInputView {
    #$container = document.querySelector('#main-container');

    constructor({ onSubmit }) {
        this.#render();
        this.#bindSubmit(onSubmit);
    }

    #render() {
        this.#$container.querySelector('#input-winning-lotto-nums')?.remove();
        this.#$container.insertAdjacentHTML(
            'beforeend',
            `
            <form class="mt-9" id="input-winning-lotto-nums" aria-labelledby="input-winning-numbers">
                <label id="input-winning-numbers" class="flex-auto d-inline-block mb-3">
                    지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.
                </label>
                <div class="d-flex">
                    <div>
                        <p class="mt-0 mb-3 text-center font-bold">당첨 번호</p>
                        <div>
                            ${Array.from(
                                { length: 6 },
                                (_, i) => `
                                <input
                                    type="number"
                                    class="winning-number lotto-number mx-1 text-center"
                                    aria-label="winning-number-${i + 1}"
                                    data-index-num="${i}"
                                    required
                                    min="1"
                                    max="45"
                                />`,
                            ).join('')}
                        </div>
                    </div>
                    <div class="bonus-number-container flex-grow">
                        <p class="mt-0 mb-3 text-center font-bold">보너스 번호</p>
                        <div class="d-flex justify-center">
                            <input
                                type="number"
                                class="winning-number bonus-number text-center"
                                aria-label="winning-number-bonus"
                                data-index-num="6"
                                required
                                min="1"
                                max="45"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    id="show-result-btn"
                    class="open-result-modal-button mt-5 btn btn-cyan w-100"
                >
                    결과 확인하기
                </button>
            </form>
        `,
        );
    }

    #getUserInput() {
        const $inputWinningNumbers = document.querySelectorAll('.winning-number.lotto-number');
        const $bonusNumber = document.querySelector('.winning-number.bonus-number');

        const winningNumbers = Array.from($inputWinningNumbers).map(($lottoNumber) =>
            convertToMatchingDataType($lottoNumber.value),
        );
        const bonusNumber = convertToMatchingDataType($bonusNumber.value);

        return { winningNumbers, bonusNumber };
    }

    #bindSubmit(onSubmit) {
        document.querySelector('#input-winning-lotto-nums').addEventListener('submit', (event) => {
            event.preventDefault();
            try {
                onSubmit(this.#getUserInput());
            } catch (error) {
                alert(error.message);
            }
        });
    }
}
