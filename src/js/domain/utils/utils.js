export const isNumber = (target) => typeof target === 'number';
export const isBoolean = (target) => typeof target === 'boolean';

export const hasDuplicated = (targets) =>
    new Set(targets).size !== targets.length;
