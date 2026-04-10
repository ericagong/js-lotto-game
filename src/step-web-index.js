/**
 * 웹 로또 게임의 시작점이 되는 파일입니다.
 */

// CSS는 JS에서 import해야 webpack의 의존성 그래프에 포함되어 dist로 출력된다.
// MiniCssExtractPlugin이 styles.css로 추출 → HtmlWebpackPlugin이 <link>를 자동 주입한다.
// 자세한 내용 및 대안 비교는 docs/STEP4.md "FOUC 문제 해결" 챕터 참고.
import './css/index.css';
import runWebLottoGame from './js/web/runWebLottoGame.js';

runWebLottoGame();
