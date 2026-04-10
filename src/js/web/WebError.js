import AppError from '../AppError.js';

export default class WebError extends AppError {
    static #type = 'WEB';

    constructor(message) {
        super(WebError.#type, message);
    }
}
