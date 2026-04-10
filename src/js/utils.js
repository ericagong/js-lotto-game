export const isNumber = (target) => typeof target === 'number';
export const isBoolean = (target) => typeof target === 'boolean';

export const hasDuplicated = (targets) => new Set(targets).size !== targets.length;

export const toPercentage = (ratio) => {
    const percentage = ratio * 100;
    return Number.isInteger(percentage) ? percentage : Number(percentage.toFixed(2));
};
