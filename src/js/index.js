// web
import { runWebStateMachine } from './controller/webStateMachine.js';
import WebView from './UI/web/View.js';

const view = new WebView();

runWebStateMachine(view);
