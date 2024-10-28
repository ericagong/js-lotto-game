import Rank from '../../entities/Rank/Rank.js';

export const getRank = (targetLotto, winningLotto) => {
    const targetNumbers = targetLotto.getNumbers();

    const matchCount = winningLotto.getMatchCount(targetNumbers);
    const isBonusMatch = winningLotto.getIsBonusMatch(targetNumbers);

    return Rank.from(matchCount, isBonusMatch);
};