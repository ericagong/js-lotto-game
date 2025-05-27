// web
// import {step2, step3} from './controller/steps.js';

import Lottos from './domain/models/service/Lottos/index.js';

console.log('connected');

const $inputPrice = document.querySelector('#input-price');
const $inputPriceButton = document.querySelector('#input-price-button');

const $lottoSwitchButton = document.querySelector('#lotto-switch-button');

$lottoSwitchButton.addEventListener('change', (e) => {
    const showNumbers = e.target.checked;

    document.querySelectorAll('.lotto-item').forEach(($item) => {
        $item.classList.toggle('w-100', showNumbers);
    });

    document.querySelectorAll('.lotto-numbers').forEach(($number) => {
        $number.classList.toggle('none', !showNumbers);
    });
});

const initialize = () => {};

let lottos = [];
const step1 = (budget) => {
    try {
        lottos = Lottos.issue(budget);

        const $purchsedLottoSection = document.querySelector('#purchased-lottos');
        $purchsedLottoSection.classList.remove('none');

        const $totalPurchasedCount = document.querySelector('#total-purchased');
        $totalPurchasedCount.textContent = lottos.length;

        const issuedLottos = lottos
            .map((lotto) => {
                return `
              <div class="lotto-item d-flex flex-row my-2">
                <div class="lotto-icon mx-1 text-4xl">🎟️</div>
                <div class="lotto-numbers none text-base mt-2">${lotto.getNumbers().join(', ')}</div>
              </div>
            `;
            })
            .join('');
        const $lottosContainer = document.querySelector('#lottos-container');
        $lottosContainer.innerHTML = issuedLottos;

        const $inputWinningNumbers = document.querySelector('#input-winning-lotto-nums');
        $inputWinningNumbers.classList.remove('none');
    } catch (error) {
        window.alert(error.message);
        $inputPrice.value = '';
    }
};

const onPriceSubmit = (event) => {
    event.preventDefault();
    // convert
    const budget = Number($inputPrice.value);

    step1(budget);
};

$inputPriceButton.addEventListener('click', onPriceSubmit);

const onWinningNumbersSubmit = (event) => {
    event.preventDefault();
    const $inputWinningNumbers = document.querySelectorAll('.winning-number.lotto-number');
    const winningNumbers = Array.from($inputWinningNumbers).map(($lottoNumber) => Number($lottoNumber.value));
    const $inputBonusNumber = document.querySelector('.winning-number.bonus-number');
    const bonusNumber = Number($inputBonusNumber.value);

    console.log(winningNumbers, bonusNumber);
};

const $inputWinningNumbers = document.querySelector('#input-winning-lotto-nums');
$inputWinningNumbers.addEventListener('submit', onWinningNumbersSubmit);

// const $showResultButton = document.querySelector('.open-result-modal-button');
// const $modalClose = document.querySelector('.modal-close');
// const $modal = document.querySelector('.modal');
// const $lottoNumbersToggleButton = document.querySelector(
//     '.lotto-numbers-toggle-button',
// );

// const onModalShow = () => {
//     $modal.classList.add('open');
// };

// const onModalClose = () => {
//     $modal.classList.remove('open');
// };

// $showResultButton.addEventListener('click', onModalShow);
// $modalClose.addEventListener('click', onModalClose);
