import Rank from '../../entities/Rank/Rank.js';

export const getRank = (targetLotto, winningLotto) => {
    const matchCount = winningLotto.getMatchCount(targetLotto);
    const isBonusMatch = winningLotto.matchBonusNumber(targetLotto);

    return Rank.from(matchCount, isBonusMatch);
};
