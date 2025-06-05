import { STATE } from '../../controller/state.js';
import { priceFormTemplate, winningLottoFormTemplate } from './formTemplates.js';
import { getPurchasedPrice, getWinningLottoNumbers } from './getUserInputFromForm.js';
import { purchasedOutputTemplate, statisticsOutputTemplate } from './outputTemplates.js';
import { setPurchasedStateEvents, setWinningNumbersStateEvents } from './eventHandlers.js';

export default class WebView {
    constructor() {}

    static display($element, $container = WebView.#MAIN_CONTAINER) {
        $container.insertAdjacentHTML('beforeend', $element);
    }

    static inputTemplateRegistry = Object.freeze({
        [STATE.PURCHASE]: priceFormTemplate,
        [STATE.WINNING_NUMBERS]: winningLottoFormTemplate,
    });

    static eventTargetRegistry = Object.freeze({
        [STATE.PURCHASE]: '#input-price-form',
        [STATE.WINNING_NUMBERS]: '#input-winning-lotto-nums',
    });

    static getUserInputRegistry = Object.freeze({
        [STATE.PURCHASE]: getPurchasedPrice,
        [STATE.WINNING_NUMBERS]: getWinningLottoNumbers,
    });

    static outputTemplateRegistry = Object.freeze({
        [STATE.PURCHASE]: purchasedOutputTemplate,
        [STATE.WINNING_NUMBERS]: statisticsOutputTemplate,
    });

    static extraEventHandlerRegistry = Object.freeze({
        [STATE.PURCHASE]: setPurchasedStateEvents,
        [STATE.WINNING_NUMBERS]: setWinningNumbersStateEvents,
    });

    bindDomainLogicHandler(state, handler) {
        const selector = WebView.eventTargetRegistry[state];
        const $formElement = document.querySelector(selector);

        $formElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userInput = WebView.getUserInputRegistry[state]();
            await handler(userInput);
        });
    }

    async ask(state) {
        const inputTemplate = WebView.inputTemplateRegistry[state];

        if (!inputTemplate) {
            return;
        }

        WebView.display(inputTemplate());
    }

    static #MAIN_CONTAINER = document.querySelector('#main-container');
    static #APP_CONTAINER = document.querySelector('#app');
    render(state, data) {
        const outputTemplate = WebView.outputTemplateRegistry[state];

        if (!outputTemplate || data === undefined) {
            return;
        }

        const $container = state === STATE.WINNING_NUMBERS ? WebView.#APP_CONTAINER : WebView.#MAIN_CONTAINER;
        WebView.display(outputTemplate(data), $container);

        const setExtraEventHandler = WebView.extraEventHandlerRegistry[state];
        setExtraEventHandler();
    }

    handleError(error) {
        alert(error.message);
    }

    terminate() {
        window.location.reload();
    }
}
