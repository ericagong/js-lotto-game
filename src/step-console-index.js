/**
 * console 로또 게임의 (step 1, 2) 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import { runConsoleStateMachine } from './js/controller/consoleStateMachine.js';
import ConsoleView from './js/UI/console/View.js';
import withRetry from './js/controller/withRetry.js';

const view = new ConsoleView();

// step1
// runConsoleStateMachine(view, { haltOnError: true });

// step2
withRetry(runConsoleStateMachine, view, { haltOnError: false });
