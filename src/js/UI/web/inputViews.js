import { render } from './interface.js';
import { convertToMatchingDataType } from '../converter.js';

// utils
const setHandlerToForm = (formSelector, extractDataFunc, handler) => {
    const $form = document.querySelector(formSelector);

    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = extractDataFunc($form);
        await handler(data);
    });
};

// INITIALIZE STATE
const priceFormTemplate = () => `
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

const extractPriceData = () => {
    const input = document.querySelector('#input-price').value;
    const price = convertToMatchingDataType(input);

    return { price };
};

export const setHandlerToPriceForm = (handler) => {
    setHandlerToForm('#input-price-form', extractPriceData, handler);
};

export const priceFormView = () => {
    const priceForm = priceFormTemplate();
    render(priceForm);
};

// PURCHASED STATTE
const winningLottoFormTemplate = () =>
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

const extractWinningLottoData = () => {
    const $inputWinningNumbers = document.querySelectorAll('.winning-number.lotto-number');
    const $bonusNumber = document.querySelector('.winning-number.bonus-number');

    const winningNumbers = Array.from($inputWinningNumbers).map(($lottoNumber) =>
        convertToMatchingDataType($lottoNumber.value),
    );
    const bonusNumber = convertToMatchingDataType($bonusNumber.value);

    return { winningNumbers, bonusNumber };
};

export const setHandlerToWinningLottoForm = (handler) => {
    setHandlerToForm('#input-winning-lotto-nums', extractWinningLottoData, handler);
};

export const winningLottoFormView = () => {
    const winningLottoForm = winningLottoFormTemplate();
    render(winningLottoForm);
};
