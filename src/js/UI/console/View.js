import readline from 'readline';
import { STATE } from '../../controller/state.js';
import { convertToMatchingDataType, convertToArray, convertToLowerCase } from '../converter.js';

export default class View {
    constructor() {
        this.interface = View.#createConsoleInterface();
    }

    static #createConsoleInterface() {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    static #messageRegistry = Object.freeze({
        [STATE.PURCHASE]: '> 구입금액을 입력해 주세요. ',
        [STATE.WINNING_NUMBERS]: '\n> 당첨 번호를 입력해 주세요. ',
        [STATE.BONUS_NUMBER]: '\n> 보너스 번호를 입력해 주세요. ',
        [STATE.RETRY]: '\n> 다시 시작하시겠습니까? (y/n) ',
    });

    static #converterReigstry = Object.freeze({
        [STATE.PURCHASE]: convertToMatchingDataType,
        [STATE.WINNING_NUMBERS]: convertToArray,
        [STATE.BONUS_NUMBER]: convertToMatchingDataType,
        [STATE.RETRY]: convertToLowerCase,
    });

    static #write(...args) {
        args.forEach((arg) => console.log(arg));
    }

    static #outputTemplateRegistry = Object.freeze({
        [STATE.PURCHASE]: ({ issuedCount, issuedLottosNumbers }) => {
            View.#write(`총 ${issuedCount}개를 구매했습니다.`);
            View.#write(...issuedLottosNumbers);
        },
        [STATE.STATISTICS]: ({ rankSummary, revenueRate }) => {
            View.#write('\n', '당첨 통계', '-'.repeat(20));
            rankSummary.forEach(({ matchCount, isBonusMatch, prize, count }) => {
                View.#write(`${matchCount}개 일치${isBonusMatch ? ', 보너스 볼 일치' : ''} (${prize}원) - ${count}개`);
            });
            View.#write(`총 수익률은 ${revenueRate}%입니다.`);
        },
    });

    async ask(state) {
        const guideMessage = View.#messageRegistry[state];
        const converter = View.#converterReigstry[state];

        if (!guideMessage || !converter) {
            return;
        }

        return new Promise((resolve) => {
            this.interface.question(guideMessage, (userInput) => {
                const convertedInput = converter(userInput);
                resolve(convertedInput);
            });
        });
    }

    render(state, data) {
        const outputTemplate = View.#outputTemplateRegistry[state];
        if (outputTemplate) {
            outputTemplate(data);
        }
    }

    handleError(error) {
        View.#write(`[${error.type}] ${error.message}`);
    }

    terminate() {
        this.interface.close();
    }
}
