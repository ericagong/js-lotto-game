/**
 * 웹 로또 게임의 시작점이 되는 파일입니다.
 */

// [JS 파일에 CSS를 직접 import한 이유]
// webpack은 entry의 import 그래프에 포함된 모듈만 dist로 출력한다.
// HTML에 <link>로 꼽기만 하면 그래프 밖이라 dist에 복사되지 않아 dev/prod 모두 404가 난다.
//
// [선택지]
//   1. JS에서 import + style-loader → 런타임에 <style> 태그로 주입 (현재 채택)
//   2. JS에서 import + MiniCssExtractPlugin → 별도 .css 파일로 추출 + <link> 자동 주입
//
// [선택 이유]
// 2번이 프로덕션 표준이지만(FOUC 방지, CSS 캐싱 분리, 번들 사이즈 절약),
// 본 프로젝트는 학습용 소규모 SPA라 추가 플러그인 없이 1번으로 충분하다고 판단해 우선 1안으로 구현했다.
import './css/index.css';
import runWebLottoGame from './js/web/runWebLottoGame.js';

runWebLottoGame();
