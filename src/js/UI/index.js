import {
    addPurchasingPriceHandler,
    addWinningNumberHandler,
    addBonusNumberHandler,
    addRetryHandler,
    close,
} from './consoleReader.js';
import {
    dividerTemplate,
    purchasedTemplate,
    lottoNumberTemplate,
    statisticsGuideTemplate,
    rankSummaryTemplate,
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
        dividerTemplate,
        purchasedTemplate,
        lottoNumberTemplate,
        statisticsGuideTemplate,
        rankSummaryTemplate,
        totalRevenueTemplate,
        errorMessageTemplate,
    };
}
