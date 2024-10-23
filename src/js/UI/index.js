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
    totalRevenueTemplate,
    errorMessageTemplate,
} from './consoleWritter.js';

export default function createView() {
    return {
        // reader,
        addPurchasingPriceHandler,
        addWinningNumberHandler,
        addBonusNumberHandler,
        addRetryHandler,
        close,
        // writter
        purchasedTemplate,
        lottoNumbersTemplate,
        statisticsTemplate,
        totalRevenueTemplate,
        errorMessageTemplate,
    };
}
