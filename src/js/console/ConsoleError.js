import CoreError from '../CoreError.js';

export default class ConsoleError extends CoreError {
    static #type = 'CONSOLE';

    constructor(message) {
        super(ConsoleError.#type, message);
    }
}
