import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const readLine = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

export const printLine = (text = '') => console.log(text);

export const close = () => rl.close();
