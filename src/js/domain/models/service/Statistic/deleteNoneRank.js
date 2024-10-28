import Rank from '../../entities/Rank/Rank.js';

export const deleteNoneRank = (counter) => {
    counter.delete(Rank.NONE);
    return counter;
};
