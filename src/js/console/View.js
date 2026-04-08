import readline from 'readline';
import { convertToMatchingDataType, convertToArray, convertToLowerCase } from './converter.js';

export default class ConsoleView {
    #rl;

    constructor() {
        this.#rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    #question(message) {
        return new Promise((resolve) => this.#rl.question(message, resolve));
    }

    async askBudget() {
        const input = await this.#question('> 구입금액을 입력해 주세요. ');
        return convertToMatchingDataType(input);
    }

    async askWinningNumbers() {
        const input = await this.#question('\n> 당첨 번호를 입력해 주세요. ');
        return convertToArray(input);
    }

    async askBonusNumber() {
        const input = await this.#question('\n> 보너스 번호를 입력해 주세요. ');
        return convertToMatchingDataType(input);
    }

    async askRetry() {
        const input = await this.#question('\n> 다시 시작하시겠습니까? (y/n) ');
        return convertToLowerCase(input);
    }

    showIssuedLottos({ issuedCount, issuedLottosNumbers }) {
        console.log(`총 ${issuedCount}개를 구매했습니다.`);
        issuedLottosNumbers.forEach((nums) => console.log(nums));
    }

    showStatistics({ rankSummary, revenueRate }) {
        console.log('\n', '당첨 통계', '-'.repeat(20));
        rankSummary.forEach(({ matchCount, isBonusMatch, prize, count }) => {
            console.log(`${matchCount}개 일치${isBonusMatch ? ', 보너스 볼 일치' : ''} (${prize}원) - ${count}개`);
        });
        console.log(`총 수익률은 ${revenueRate}%입니다.`);
    }

    showError(error) {
        console.log(`[${error.type}] ${error.message}`);
    }

    close() {
        this.#rl.close();
    }
}
