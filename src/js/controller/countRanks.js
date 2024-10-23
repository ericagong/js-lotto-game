import Rank from '../domain/models/Rank/Rank.js';

export default function countRanks(ranks) {
    const rankCounter = new Map([
        [Rank.of(1), 0],
        [Rank.of(2), 0],
        [Rank.of(3), 0],
        [Rank.of(4), 0],
        [Rank.of(5), 0],
        [Rank.of(6), 0], // 낙첨
    ]);

    ranks.forEach((rank) => {
        rankCounter.set(rank, rankCounter.get(rank) + 1 || 0);
    });

    return rankCounter;
}
