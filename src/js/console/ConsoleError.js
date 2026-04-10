import AppError from '../AppError.js';

export default class ConsoleError extends AppError {
    static #type = 'CONSOLE';

    constructor(message) {
        super(ConsoleError.#type, message);
    }
}
