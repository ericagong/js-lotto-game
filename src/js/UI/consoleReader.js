import readline from 'readline';
import { convertToMatchingDataType, convertToArray } from './typeConverter.js';

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const GUIDE_MESSAGES = Object.freeze({
    PURCHASING_PRICE: '> 구입금액을 입력해 주세요. ',
    WINNING_NUMBER: '\n> 당첨 번호를 입력해 주세요. ',
    BONUS_NUMBER: '\n> 보너스 번호를 입력해 주세요. ',
    RETRY: '\n> 다시 시작하시겠습니까? (y/n) ',
});

async function readlineFromConsole(guideMessage) {
    return new Promise((resolve) => {
        readlineInterface.question(guideMessage, resolve);
    });
}

export async function addPurchasingPriceHandler(eventHandler) {
    const purchasingPriceInput = await readlineFromConsole(
        GUIDE_MESSAGES.PURCHASING_PRICE,
    );

    const purchasingPrice = convertToMatchingDataType(purchasingPriceInput);

    eventHandler(purchasingPrice);
}

export async function addWinningNumberHandler(eventHandler) {
    const winningNumbersInput = await readlineFromConsole(
        GUIDE_MESSAGES.WINNING_NUMBER,
    );

    const winningNumbers = convertToArray(winningNumbersInput);

    eventHandler(winningNumbers);
}

export async function addBonusNumberHandler(eventHandler) {
    const bonusNumberInput = await new Promise((resolve) =>
        readlineInterface.question('> 보너스 번호를 입력해 주세요. ', resolve),
    );
    const bonusNumber = convertToMatchingDataType(bonusNumberInput);

    eventHandler(bonusNumber);
}

export async function addRetryHandler(eventHandler) {
    const retryInput = await readlineFromConsole(GUIDE_MESSAGES.RETRY);

    const retry = convertToMatchingDataType(retryInput);

    eventHandler(retry);
}

export function close() {
    readlineInterface.close();
}
