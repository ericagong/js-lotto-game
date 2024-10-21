import {
    addPurchasingPriceHandler,
    addWinningNumberHandler,
    addBonusNumberHandler,
    addRetryHandler,
    close,
} from './consoleReader.js';
import {
    purchasedTemplate,
    lottoNumbersTemplate,
    statisticsTemplate,
    errorMessageTemplate,
} from './consoleWritter.js';

export default function createView() {
    return {
        addPurchasingPriceHandler,
        addWinningNumberHandler,
        addBonusNumberHandler,
        addRetryHandler,
        close,
        purchasedTemplate,
        lottoNumbersTemplate,
        statisticsTemplate,
        errorMessageTemplate,
    };
}
