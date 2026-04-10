import AppError from '../AppError.js';

export default class DomainError extends AppError {
    static #type = 'DOMAIN';

    constructor(message) {
        super(DomainError.#type, message);
    }
}
