/**
 * console 로또 게임의 시작점이 되는 파일입니다.
 */
import runConsoleLottoGame from './js/console/runConsoleLottoGame.js';

// step2에서는 사용자로부터 재시작 여부를 입력받아 게임을 반복한다.
// 만약 step1이라면 재시작 기능이 없으므로, 해당 값을 false로 바꿔야한다.
const SHOULD_RETRY = true;

runConsoleLottoGame(SHOULD_RETRY);
