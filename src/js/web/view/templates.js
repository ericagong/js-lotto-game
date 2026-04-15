import { toPercentage } from '../../utils.js';
import Rank from '../../domain/entity/Rank/Rank.js';

export const priceFormTemplate = () => `
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
`;

const lottoNumberInput = (index) => `
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-${index + 1}"
                        data-index-num="${index}"
                        required
                        min="1"
                        max="45"
                    />`;

const WINNING_NUMBER_COUNT = 6;
export const winningLottoFormTemplate = () => {
    const winningNumberInputs = Array.from({ length: WINNING_NUMBER_COUNT }, (_, i) => lottoNumberInput(i)).join('');

    return `<form class="mt-9" id="input-winning-lotto-nums" aria-labelledby="input-winning-numbers">
        <label id="input-winning-numbers" class="flex-auto d-inline-block mb-3">
            지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.
        </label>
        <div class="d-flex">
            <div>
                <p class="mt-0 mb-3 text-center font-bold">당첨 번호</p>
                <div>${winningNumberInputs}
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
`;
};

const issuedLottosTemplate = ({ lottoNumbers }) => `
    <div class="lotto-item d-flex flex-row my-2">
        <div class="lotto-icon mx-1 text-4xl">🎟️</div>
        <div class="lotto-numbers none text-base mt-2">${lottoNumbers.join(', ')}</div>
    </div>
`;

export const purchasedOutputTemplate = ({ issuedCount, issuedLottosNumbers }) => {
    const issuedLottos = issuedLottosNumbers.map((lottoNumbers) => issuedLottosTemplate({ lottoNumbers })).join('');

    return `<section id="purchased-lottos-section" class="mt-9" aria-label="purchase-items">
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
    `;
};

const RANK_LABELS = new Map([
    [Rank.FIFTH, '3개'],
    [Rank.FOURTH, '4개'],
    [Rank.THIRD, '5개'],
    [Rank.SECOND, '5개 + 보너스볼'],
    [Rank.FIRST, '6개'],
]);

const RankRowTemplate = ({ rank, count }) => `
    <tr class="text-center">
        <td class="p-3">${RANK_LABELS.get(rank)}</td>
        <td class="p-3">${rank.prize.toLocaleString()}</td>
        <td class="p-3">
            <span class="match-count">${count}</span> 개
        </td>
    </tr>
`;

export const statisticsOutputTemplate = ({ rankSummary, revenueRate }) => {
    const statisticsTableRows = [...rankSummary]
        .reverse()
        .map(({ rank, count }) => RankRowTemplate({ rank, count }))
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
                <span id="profit">${toPercentage(revenueRate)}</span>
                % 입니다.
            </p>
            <div class="d-flex justify-center mt-5">
                <button type="reset" id="reset-btn" class="btn btn-cyan">다시 시작하기</button>
            </div>
        </div>
    </section>
    `;
};
