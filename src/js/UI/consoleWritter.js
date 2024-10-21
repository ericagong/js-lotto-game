export const write = console.log;

function dividerTemplate() {
    write('');
}

export function purchasedTemplate(totalAmount) {
    write(`총 ${totalAmount}개를 구매했습니다.`);
}

export function lottoNumbersTemplate(lottoNumbersArr) {
    lottoNumbersArr.map((lottoNumber) => write(lottoNumber));
    dividerTemplate();
}

function statisticsGuideTemplate() {
    write('당첨 통계');
    write('--------------------');
}

// 1, 2, 3, 4, 5
const matchCounts = [6, 5, 5, 4, 3];
const prizes = ['2,000,000,000', '30,000,000', '1,5000,000', '50,000', '5,000'];
function summaryTemplate(count, idx) {
    const extraInfo = idx === 2 ? ', 보너스 볼 일치' : '';
    const summary = `${matchCounts[idx]}개 일치${extraInfo} (${prizes[idx]}원) - ${count}개`;
    return summary;
}

function totalRevenueTemplate(revenue) {
    write(`총 수익률은 ${revenue}%입니다.`);
    dividerTemplate();
}

export function errorMessageTemplate(message) {
    write(message);
}

// TODO : UI로직에서 도메인 로직 분리 - matchCount, prizes 데이터 받아오게 처리
export function statisticsTemplate(rankCount, revenueRate) {
    statisticsGuideTemplate();

    const ranks = [];
    const winningRankCount = rankCount.slice(0, rankCount.length - 1);
    winningRankCount.forEach((count, idx) => {
        ranks.push(summaryTemplate(count, idx));
    });
    const statistics = ranks.reverse();
    statistics.forEach((line) => write(line));

    totalRevenueTemplate(revenueRate);
}
