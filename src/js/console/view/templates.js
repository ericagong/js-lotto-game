import { toPercentage } from '../../utils.js';

// 입력 프롬프트
export const BUDGET_PROMPT = '> 구입금액을 입력해 주세요. ';
export const WINNING_NUMBERS_PROMPT = '\n> 당첨 번호를 입력해 주세요. ';
export const BONUS_NUMBER_PROMPT = '\n> 보너스 번호를 입력해 주세요. ';
export const RETRY_PROMPT = '\n> 다시 시작하시겠습니까? (y/n) ';

// 출력 포맷
export const formatIssuedCount = (count) => `총 ${count}개를 구매했습니다.`;

export const STATISTICS_HEADER = `\n 당첨 통계 ${'-'.repeat(20)}`;

const formatRankLabel = (rank) =>
    rank.isBonusMatch ? `${rank.matchCount}개 일치, 보너스 볼 일치` : `${rank.matchCount}개 일치`;

export const formatRankRow = ({ rank, count }) => `${formatRankLabel(rank)} (${rank.prize}원) - ${count}개`;

export const formatRevenueRate = (revenueRate) => `총 수익률은 ${toPercentage(revenueRate)}%입니다.`;

export const formatError = (type, message) => `[${type}] ${message}`;
