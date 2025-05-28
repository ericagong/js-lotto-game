import readline from 'readline';

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const ask = async (guideMessage) => {
    return new Promise((resolve) => {
        readlineInterface.question(guideMessage, resolve);
    });
};

export const write = (...args) => {
    args.forEach((arg) => console.log(arg));
};

export const terminate = () => {
    readlineInterface.close();
};
