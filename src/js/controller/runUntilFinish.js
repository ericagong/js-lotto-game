import runLottoGame from './runLottoGame.js';
import withRetry from './withRetry.js';

export default async function runUntilFinish() {
    return withRetry(runLottoGame);
}
