export default class ValidationError extends Error {
    static #TYPE = 'ValidationError';
    #type;
    #message;

    constructor(type, message) {
        super(message);
        this.#type = type ?? ValidationError.#TYPE;
        this.#message = message;
    }

    get type() {
        return this.#type;
    }

    get message() {
        return this.#message;
    }
}
