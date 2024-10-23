import Rank from '../../src/js/domain/models/Rank/Rank.js';
import determineRank from '../../src/js/controller/determineRank.js';

describe('determineRank(matchCount, isBonusMatch) 테스트', () => {
    Rank.initializeRanks();

    describe('matchCount와 isBonusMatch를 기반으로 부합하는 Rank를 반환한다.', () => {
        it.each([
            { matchCount: 6, isBonusMatch: false, expected: Rank.of(1) },
            { matchCount: 5, isBonusMatch: true, expected: Rank.of(2) },
            { matchCount: 5, isBonusMatch: false, expected: Rank.of(3) },
            { matchCount: 4, isBonusMatch: false, expected: Rank.of(4) },
            { matchCount: 3, isBonusMatch: false, expected: Rank.of(5) },
        ])(
            'matchCount: %matchCount, isBonusMatch: %isBonusMatch, expected: %expected',
            ({ matchCount, isBonusMatch, expected }) => {
                const rank = determineRank(matchCount, isBonusMatch);
                expect(rank).toEqual(expected);
            },
        );
    });
});
