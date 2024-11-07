export default function determineRanks(lottos, winningLotto) {
    const ranks = lottos.map((targetLotto) =>
        winningLotto.getRank(targetLotto),
    );
    return ranks;
}
