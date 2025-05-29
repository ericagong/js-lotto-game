import { convertToMatchingDataType } from '../converter.js';
import {
    issueLottosWithBudget,
    setWinningLottoNumbers,
    setBonusNumbers,
    getStatistics,
} from '../../controller/stateHandlers.js';
import { purchasedResultRenderer, statisticsResultRenderer } from './outputViews.js';
import { priceFormRenderer, winningLottoFormRenderer } from './inputViews.js';

const $mainContainer = document.querySelector('#main-container');

// view related event listeners
const setOnSubmitPrice = () => {
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

            // output view
            const outputView = purchasedResultRenderer({
                issuedCount,
                issuedLottosNumbers,
            });
            $mainContainer.insertAdjacentHTML('beforeend', outputView);
            setLottoSwitchButtonEventListener();
            const inputWinningLottoNumbersForm = winningLottoFormRenderer();
            $mainContainer.insertAdjacentHTML('beforeend', inputWinningLottoNumbersForm);
            setOnSubmitWinningLottoNumbers();
        } catch (error) {
            window.alert(error.message);
            priceInput.value = '';
            return;
        }
    };
    $inputPriceForm.addEventListener('submit', onSubmitPrice);
};

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

        try {
            setWinningLottoNumbers(winningNumbers);
            setBonusNumbers(bonusNumber);
            const { rankSummary, revenueRate } = getStatistics();

            const modal = statisticsResultRenderer({ rankSummary, revenueRate });
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
    const inputPriceForm = priceFormRenderer();
    $mainContainer.insertAdjacentHTML('beforeend', inputPriceForm);
    setOnSubmitPrice();
};
