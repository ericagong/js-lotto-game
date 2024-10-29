export const write = console.log;

export const dividerTemplate = () => {
    write('');
};

export const purchasedTemplate = (purchasedCount) => {
    const purchasedCountText = `${purchasedCount}개`;
    write(`총 ${purchasedCountText}를 구매했습니다.`);
};

export const lottoNumberTemplate = (numbers) => {
    write(numbers);
};

const DIVIDE_LINE = '-'.repeat(20);
export const statisticsGuideTemplate = () => {
    write('당첨 통계');
    write(DIVIDE_LINE);
};

export const rankSummaryTemplate = ({
    matchCount,
    isBonusMatch,
    prize,
    count,
}) => {
    const matchCountText = `${matchCount}개 일치`;
    const bonusMatchText = isBonusMatch ? ', 보너스 볼 일치' : '';
    const prizeText = `(${prize}원)`;
    const countText = `${count}개`;
    write(`${matchCountText}${bonusMatchText} ${prizeText} - ${countText}`);
};

export const totalRevenueTemplate = (revenueRate) => {
    const revenueRateText = `${revenueRate}%`;
    write(`총 수익률은 ${revenueRateText}입니다.`);
};

export const errorMessageTemplate = (type, message) => {
    write(`[${type}] ${message}`);
};
