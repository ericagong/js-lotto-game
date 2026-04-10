/**
 * 웹 로또 게임의 시작점이 되는 파일입니다.
 *
 * css 파일을 import하는 이유:
 * webpack은 entry로부터 import 그래프를 따라가며 번들에 포함될 모듈을 결정한다.
 * CSS는 JS에서 직접 import해야 webpack의 의존성 그래프에 포함되고,
 * style-loader + css-loader가 이를 처리해 빌드 결과에 스타일이 주입된다.
 * (step-web.config.cjs의 module.rules 참고)
 */

import './css/index.css';
import runWebLottoGame from './js/web/runWebLottoGame.js';

runWebLottoGame();
