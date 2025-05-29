// output views

// PURCHASE
export const purchasedResultRenderer = ({ issuedCount, issuedLottosNumbers }) => `
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
            ${issuedLottosNumbers
                .map(
                    (lottoNumbers) => `
              <div class="lotto-item d-flex flex-row my-2">
                <div class="lotto-icon mx-1 text-4xl">🎟️</div>
                <div class="lotto-numbers none text-base mt-2">${lottoNumbers.join(', ')}</div>
              </div>
            `,
                )
                .join('')}
        </div>
    </section>
`;

// STATISTICS
export const statisticsResultRenderer = ({ rankSummary, revenueRate }) => {
    const statisticsTableRows = rankSummary
        .reverse()
        .map(
            ({ matchCount, isBonusMatch, prize, count }) =>
                `
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
    return `<section class="modal open" role="dialog" aria-modal="true" aria-labelledby="title-dialog">
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
    </section>
`;
};
