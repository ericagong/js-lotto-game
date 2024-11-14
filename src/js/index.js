// web

import Lottos from './domain/models/service/Lottos/index.js';

console.log('connected');

const $priceInput = document.querySelector('#price-input');
const $priceSubmitButton = document.querySelector('#price-submit-button');

let lottos = [];
const step1 = (budget) => {
    try {
        lottos = Lottos.issue(budget);
        const issuedCount = lottos.length;
        console.log(lottos);
        console.log(issuedCount);
    } catch (error) {
        window.alert(error.message);
        $priceInput.value = '';
    }
};

const onPriceSubmit = () => {
    const budget = Number($priceInput.value);
    step1(budget);
};

$priceSubmitButton.addEventListener('click', onPriceSubmit);

const toggleDisplay = (element) => {
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
};

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
