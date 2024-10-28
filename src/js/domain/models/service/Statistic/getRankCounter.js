import Rank from '../../entities/Rank/Rank.js';

const countRanks = (ranks) => {
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

const deleteNoneRank = (counter) => {
    counter.delete(Rank.NONE);
    return counter;
};

export const getRankCounter = (ranks) => {
    const counter = countRanks(ranks);
    deleteNoneRank(counter);
    return counter;
};
