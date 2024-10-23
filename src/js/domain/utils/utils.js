// TODO 순환참조 문제 해결
export const isNumber = (target) => typeof target === 'number';
export const isBoolean = (target) => typeof target === 'boolean';
export const isArray = (target) => Array.isArray(target);

export const isInteger = (target) => Number.isInteger(target);

export const hasDuplicated = (targets) =>
    new Set(targets).size !== targets.length;
