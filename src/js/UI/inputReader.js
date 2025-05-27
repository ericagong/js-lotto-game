import { STEPS } from '../utils.js';
import readline from 'readline';
import { converterReigstry } from './inputConverter.js';

export const messageRegistry = Object.freeze({
    [STEPS.PURCHASE]: '> 구입금액을 입력해 주세요. ',
    [STEPS.WINNING_NUMBERS]: '\n> 당첨 번호를 입력해 주세요. ',
    [STEPS.BONUS_NUMBER]: '\n> 보너스 번호를 입력해 주세요. ',
});

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const readlineFromConsole = async (guideMessage) => {
    return new Promise((resolve) => {
        readlineInterface.question(guideMessage, resolve);
    });
};

export const createStepper = (stepSequence) => {
    return async (logicRegistry) => {
        for(const step of stepSequence) {
            const message = messageRegistry[step];
            const converter = converterReigstry[step];

            if(!message || !converter) {
                logicRegistry[step]();
                continue;
            }

            const input = await readlineFromConsole(message);
            const convertedInput = converter(input);
            const handler = logicRegistry[step];
            await handler(convertedInput);
        }
    }
}

export const close = () => {
    readlineInterface.close();
};
