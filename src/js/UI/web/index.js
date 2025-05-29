import { convertToMatchingDataType } from '../converter.js';
import {
    issueLottosWithBudget,
    setWinningLottoNumbers,
    setBonusNumbers,
    getStatistics,
} from '../../controller/stateHandlers.js';

const $mainContainer = document.querySelector('#main-container');
const $inputPriceForm = document.querySelector('#input-price-form');
const onSubmitPrice = (event) => {
    event.preventDefault();
    // input view
    const priceInput = document.querySelector('#input-price');
    const input = priceInput.value;
    const converted = convertToMatchingDataType(input);

    try {
        // 비즈니스 로직
        const { issuedCount, issuedLottosNumbers } = issueLottosWithBudget(converted);
        console.log(issuedCount, issuedLottosNumbers);
        // output view
        const outputView = renderPurchasedLottoSection({
            issuedCount,
            issuedLottosNumbers,
        });
        $mainContainer.insertAdjacentHTML('beforeend', outputView);
        setLottoSwitchButtonEventListener();
        const inputWinningLottoNumbersForm = renderInputWinningLottoNumbersForm();
        $mainContainer.insertAdjacentHTML('beforeend', inputWinningLottoNumbersForm);
        setOnSubmitWinningLottoNumbers();
    } catch (error) {
        window.alert(error.message);
        priceInput.value = '';
        return;
    }
};

// views
const renderPurchasedLottoSection = ({ issuedCount, issuedLottosNumbers }) => `
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

const renderInputWinningLottoNumbersForm = () =>
    `<form class="mt-9" id="input-winning-lotto-nums" aria-labelledby="input-winning-numbers">
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
`;

const renderStatisticModal = ({ rankSummary, revenueRate }) => {
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

// view related event listeners
const setLottoSwitchButtonEventListener = () => {
    const $lottoSwitchButton = document.querySelector('#lotto-switch-button');
    const onToggle = (event) => {
        const showNumbers = event.target.checked;

        document.querySelectorAll('.lotto-item').forEach(($item) => {
            $item.classList.toggle('w-100', showNumbers);
        });

        document.querySelectorAll('.lotto-numbers').forEach(($number) => {
            $number.classList.toggle('none', !showNumbers);
        });
    };
    $lottoSwitchButton.addEventListener('change', onToggle);
};

const setOnSubmitWinningLottoNumbers = () => {
    const $inputWinningLottoNumbersForm = document.querySelector('#input-winning-lotto-nums');

    const onSubmitWinningNumbers = (event) => {
        event.preventDefault();
        const $inputWinningNumbers = document.querySelectorAll('.winning-number.lotto-number');
        const winningNumbers = Array.from($inputWinningNumbers).map(($lottoNumber) =>
            convertToMatchingDataType($lottoNumber.value),
        );
        const $inputBonusNumber = document.querySelector('.winning-number.bonus-number');
        const bonusNumber = convertToMatchingDataType($inputBonusNumber.value);

        console.log(winningNumbers, bonusNumber);

        try {
            setWinningLottoNumbers(winningNumbers);
            setBonusNumbers(bonusNumber);
            const { rankSummary, revenueRate } = getStatistics();
            console.log(rankSummary, revenueRate);
            const modal = renderStatisticModal({ rankSummary, revenueRate });
            const $app = document.querySelector('#app');
            $app.insertAdjacentHTML('beforeend', modal);
            setModalToggleEventListener();
            setResetButtonEventListener();
        } catch (error) {
            window.alert(error.message);
            return;
        }
    };

    $inputWinningLottoNumbersForm.addEventListener('submit', onSubmitWinningNumbers);
};

const setModalToggleEventListener = () => {
    const $modalCloseButton = document.querySelector('.modal-close');

    const onCloseModal = () => {
        const $modal = document.querySelector('.modal.open');
        $modal.classList.remove('open');
        $modal.remove();
    };

    $modalCloseButton.addEventListener('click', onCloseModal);
};

const setResetButtonEventListener = () => {
    const $resetButton = document.querySelector('#reset-btn');

    const onReset = () => {
        window.location.reload();
    };

    $resetButton.addEventListener('click', onReset);
};

export const initialize = () => {
    $inputPriceForm.addEventListener('submit', onSubmitPrice);
};
