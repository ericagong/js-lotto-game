import { convertToMatchingDataType } from '../converter.js';

export default class WinningNumbersView {
    #$container = document.querySelector('#main-container');
    #$appContainer = document.querySelector('#app');

    renderForm() {
        this.#$container.insertAdjacentHTML('beforeend', `
            <form class="mt-9" id="input-winning-lotto-nums" aria-labelledby="input-winning-numbers">
                <label id="input-winning-numbers" class="flex-auto d-inline-block mb-3">
                    지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.
                </label>
                <div class="d-flex">
                    <div>
                        <p class="mt-0 mb-3 text-center font-bold">당첨 번호</p>
                        <div>
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-1"
                                data-index-num="0"
                                required
                                min="1"
                                max="45"
                            />
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-2"
                                data-index-num="1"
                                required
                                min="1"
                                max="45"
                            />
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-3"
                                data-index-num="2"
                                required
                                min="1"
                                max="45"
                            />
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-4"
                                data-index-num="3"
                                required
                                min="1"
                                max="45"
                            />
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-5"
                                data-index-num="4"
                                required
                                min="1"
                                max="45"
                            />
                            <input
                                type="number"
                                class="winning-number lotto-number mx-1 text-center"
                                aria-label="winning-number-6"
                                data-index-num="5"
                                required
                                min="1"
                                max="45"
                            />
                        </div>
                    </div>
                    <div class="bonus-number-container flex-grow">
                        <p class="mt-0 mb-3 text-center font-bold">보너스 번호</p>
                        <div class="d-flex justify-center">
                            <input
                                type="number"
                                class="winning-number bonus-number text-center"
                                aria-label="winning-number-bounus"
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
        `);
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

    onSubmit(handler) {
        const $formElement = document.querySelector('#input-winning-lotto-nums');

        $formElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userInput = this.#getUserInput();
            await handler(userInput);
        });
    }

    renderResult(data) {
        const { rankSummary, revenueRate } = data;

        const statisticsTableRows = rankSummary
            .reverse()
            .map(
                ({ matchCount, isBonusMatch, prize, count }) => `
                    <tr class="text-center">
                        <td class="p-3">${matchCount}개${isBonusMatch ? ' + 보너스볼' : ''}</td>
                        <td class="p-3">${prize.toLocaleString()}</td>
                        <td class="p-3">
                            <span class="match-count">${count}</span> 개
                        </td>
                    </tr>
                `,
            )
            .join('');

        this.#$appContainer.insertAdjacentHTML(
            'beforeend',
            `<section class="modal open" role="dialog" aria-modal="true" aria-labelledby="title-dialog">
                <div class="modal-inner p-10">
                    <button type="button" class="modal-close" aria-label="close-button">
                        <svg viewbox="0 0 40 40">
                            <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>

                    <h2 id="title-dialog" class="text-center">🏆 당첨 통계 🏆</h2>
                    <div class="d-flex justify-center">
                        <table class="result-table border-collapse border border-black p-1">
                            <thead>
                                <tr class="text-center">
                                    <th class="p-2">일치 갯수</th>
                                    <th class="p-2">당첨금</th>
                                    <th class="p-2">당첨 갯수</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${statisticsTableRows}
                            </tbody>
                        </table>
                    </div>
                    <p class="text-center font-bold p-10">
                        당신의 총 수익률은
                        <span id="profit">${revenueRate}</span>
                        % 입니다.
                    </p>
                    <div class="d-flex justify-center mt-5">
                        <button type="reset" id="reset-btn" class="btn btn-cyan">다시 시작하기</button>
                    </div>
                </div>
            </section>`,
        );

        this.#setToggleModal();
        this.#setResetGame();
    }

    #setToggleModal() {
        const $modalCloseButton = document.querySelector('.modal-close');

        $modalCloseButton.addEventListener('click', () => {
            const $modal = document.querySelector('.modal.open');
            $modal.classList.remove('open');
            $modal.remove();
        });
    }

    #setResetGame() {
        const $resetButton = document.querySelector('#reset-btn');

        $resetButton.addEventListener('click', () => {
            window.location.reload();
        });
    }
}
