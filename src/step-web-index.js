/**
 * 웹 로또 게임의 시작점이 되는 파일입니다.
 */

import './css/index.css';
import { runWebLottoGame } from './js/web/controller.js';
import WebView from './js/web/view/index.js';
import LottoGame from './js/LottoGame.js';

runWebLottoGame(new WebView(), new LottoGame());
