// TODO 순환참조 문제 해결
// import Lotto from '../models/Lotto/Lotto.js';
// import BonusNumber from '../models/BonusNumber/BonusNumber.js';

export const isNumber = (target) => typeof target === 'number';
export const isArray = (target) => Array.isArray(target);
export const isInteger = (target) => Number.isInteger(target);

// export const isInstanceOfLotto = (target) => target instanceof Lotto;
// export const isInstanceOfBonusNumber = (target) =>
//     target instanceof BonusNumber;

// 배열
export const hasDuplicated = (targets) =>
    new Set(targets).size !== targets.length;
export const sortNumbersAscending = (targets) => {
    return targets.sort((a, b) => Number(a) - Number(b));
};
