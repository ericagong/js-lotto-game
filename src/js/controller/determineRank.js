import Rank from '../domain/models/Rank/Rank.js';

// step3 - 1
// [ ] Rank의 Static으로 이동
export default function determineRank(matchCount, isBonusMatch) {
    if (matchCount === 6) return Rank.of(1);
    if (matchCount === 5 && isBonusMatch) return Rank.of(2);
    if (matchCount === 5) return Rank.of(3);
    if (matchCount === 4) return Rank.of(4);
    if (matchCount === 3) return Rank.of(5);
    return Rank.of(6); // 매칭이 3개 미만일 때 NONE 반환
}
