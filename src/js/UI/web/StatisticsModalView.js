export default class StatisticsModalView {
    #$appContainer = document.querySelector('#app');

    constructor({ rankSummary, revenueRate }) {
        this.#render({ rankSummary, revenueRate });
        this.#bindCloseModal();
        this.#bindReset();
    }

    #render({ rankSummary, revenueRate }) {
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
    }

    #bindCloseModal() {
        document.querySelector('.modal-close').addEventListener('click', () => {
            const $modal = document.querySelector('.modal.open');
            $modal.classList.remove('open');
            $modal.remove();
        });
    }

    #bindReset() {
        document.querySelector('#reset-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}
