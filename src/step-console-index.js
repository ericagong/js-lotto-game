/**
 * console 로또 게임의 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import { runConsoleLotto } from './js/controller/runConsoleLotto.js';
import ConsoleView from './js/UI/console/View.js';
import LottoGame from './js/controller/LottoGame.js';
import withRetry from './js/controller/withRetry.js';

const view = new ConsoleView();
withRetry(() => runConsoleLotto(view, new LottoGame()), view);
