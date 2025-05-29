import { write } from './interface.js';

// PURCHASE
export const purchaseResultTemplate = ({ issuedCount, issuedLottosNumbers }) => {
    write(`총 ${issuedCount}개를 구매했습니다.`);
    write(...issuedLottosNumbers);
};

// STATISTICS
export const statisticsResultTemplate = ({ rankSummary, revenueRate }) => {
    write('\n', '당첨 통계', '-'.repeat(20));
    rankSummary.forEach(({ matchCount, isBonusMatch, prize, count }) => {
        write(`${matchCount}개 일치${isBonusMatch ? ', 보너스 볼 일치' : ''} (${prize}원) - ${count}개`);
    });
    write(`총 수익률은 ${revenueRate}%입니다.`);
};
