/**
 * step 2의 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import LottoPlatform from './controller/LottoPlatform.js';

const lottoPlatform = new LottoPlatform();
lottoPlatform.runUntilFinish();