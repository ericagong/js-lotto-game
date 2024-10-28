import Rank from '../../entities/Rank/Rank.js';

export const getCounter = (ranks) => {
    const counter = new Map([
        [Rank.FIRST, 0],
        [Rank.SECOND, 0],
        [Rank.THIRD, 0],
        [Rank.FOURTH, 0],
        [Rank.FIFTH, 0],
        [Rank.NONE, 0], // 낙첨
    ]);

    ranks.forEach((rank) => {
        counter.set(rank, counter.get(rank) + 1 || 0);
    });

    return counter;
};
