import { convertToMatchingDataType } from '../converter.js';

export const getPurchasedPrice = () => {
    const input = document.querySelector('#input-price').value;
    const price = convertToMatchingDataType(input);

    return { price };
};

export const getWinningLottoNumbers = () => {
    const $inputWinningNumbers = document.querySelectorAll('.winning-number.lotto-number');
    const $bonusNumber = document.querySelector('.winning-number.bonus-number');

    const winningNumbers = Array.from($inputWinningNumbers).map(($lottoNumber) =>
        convertToMatchingDataType($lottoNumber.value),
    );
    const bonusNumber = convertToMatchingDataType($bonusNumber.value);

    return { winningNumbers, bonusNumber };
};
