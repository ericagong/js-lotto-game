import readline from 'readline';

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const readlineFromConsole = async (guideMessage) => {
    return new Promise((resolve) => {
        readlineInterface.question(guideMessage, resolve);
    });
};

export const close = () => {
    readlineInterface.close();
};
