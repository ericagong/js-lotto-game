export const convertToMatchingDataType = (input) => {
    if (input === 'null') {
        return null;
    } else if (input === 'undefined') {
        return undefined;
    } else if (/^-?\d+(\.\d+)?$/.test(input)) {
        // 가능한 모든 숫자 형태의 문자열, 숫자로 변환
        return parseFloat(input);
    } else {
        try {
            return JSON.parse(input);
        } catch (error) {
            // 그대로 반환 (문자열 유지)
            return input;
        }
    }
};

const DEFAULT_SEPERATOR = ',';
export const convertToArray = (input) => {
    return input.split(DEFAULT_SEPERATOR).map(convertToMatchingDataType);
};
