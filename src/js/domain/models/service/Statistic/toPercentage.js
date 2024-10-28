const DECIMAL_POINT = 2;
const ENDS_WITH_ZERO = /0$/;
const roundToSecondAndTrimZeroEnds = (number) => {
    return Number(number.toFixed(DECIMAL_POINT).replace(ENDS_WITH_ZERO, ''));
};

const normalize = (number) => {
    if (Number.isInteger(number)) return number;
    else return roundToSecondAndTrimZeroEnds(number);
};

const PERCENTAGE_BASE = 100;
export const toPercentage = (rate) => {
    const percentage = rate * PERCENTAGE_BASE;

    return normalize(percentage);
};
