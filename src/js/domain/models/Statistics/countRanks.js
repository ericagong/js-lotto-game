import { RANKS } from '../Rank/Rank.js';

// TODO 함수 위치 고민하기
export default function countRanks(ranks) {
    const rankCounts = new Map([
        [RANKS.FIRST, 0],
        [RANKS.SECOND, 0],
        [RANKS.THIRD, 0],
        [RANKS.FOURTH, 0],
        [RANKS.FIFTH, 0],
        [RANKS.NONE, 0],
    ]);

    ranks.forEach((rank) => {
        const key = rank.rank;
        rankCounts.set(key, rankCounts.get(key) + 1);
    });

    return Array.from(rankCounts.values());
}
