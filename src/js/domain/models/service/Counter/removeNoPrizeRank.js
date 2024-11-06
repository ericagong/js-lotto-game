import Rank from '../../entities/Rank/Rank.js';

export default function removeNoPrizeRank(counter) {
    counter.delete(Rank.NONE);
    return counter;
}
