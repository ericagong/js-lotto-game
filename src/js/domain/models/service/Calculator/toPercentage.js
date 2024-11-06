const DECIMAL_POINT = 2;
const roundToSecondDecimal = (number) => {
    return Number(number.toFixed(DECIMAL_POINT));
};

const ENDS_WITH_ZERO = /0$/;
const TrimZeroEnds = (number) => {
    return Number(number.toString().replace(ENDS_WITH_ZERO, ''));
};

const formatDecimal = (number) => {
    if (Number.isInteger(number)) return number;
    else {
        const rounded = roundToSecondDecimal(number);
        const trimmed = TrimZeroEnds(rounded);
        return trimmed;
    }
};

const PERCENTAGE_BASE = 100;
export default function toPercentage(rate) {
    const percentage = rate * PERCENTAGE_BASE;
    return formatDecimal(percentage);
}
