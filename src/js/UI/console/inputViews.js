import { STATE } from '../../controller/state.js';
import { convertToMatchingDataType, convertToArray } from '../converter.js';

export const messageRegistry = Object.freeze({
    [STATE.PURCHASE]: '> 구입금액을 입력해 주세요. ',
    [STATE.WINNING_NUMBERS]: '\n> 당첨 번호를 입력해 주세요. ',
    [STATE.BONUS_NUMBER]: '\n> 보너스 번호를 입력해 주세요. ',
});

export const converterReigstry = Object.freeze({
    [STATE.PURCHASE]: convertToMatchingDataType,
    [STATE.WINNING_NUMBERS]: convertToArray,
    [STATE.BONUS_NUMBER]: convertToMatchingDataType,
});
