export default class AppError extends Error {
    static #DEFAULT_TYPE = 'APP';
    #type;

    constructor(type, message) {
        super(message);
        this.#type = type ?? AppError.#DEFAULT_TYPE;
    }

    get type() {
        return this.#type;
    }
}
