export default function countRanks(ranks) {
    const rankCounts = new Map([
        // [index, count]
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0], // 낙첨
    ]);

    ranks.forEach((rank) => {
        rankCounts.set(rank.index, rankCounts.get(rank.index) + 1);
    });

    return Array.from(rankCounts.values());
}
