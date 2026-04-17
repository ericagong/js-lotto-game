import CoreError from '../CoreError.js';

export default class DomainError extends CoreError {
    static #type = 'DOMAIN';

    constructor(message) {
        super(DomainError.#type, message);
    }
}
