export default class CoreError extends Error {
    static #DEFAULT_TYPE = 'CORE';
    #type;

    constructor(type, message) {
        super(message);
        this.#type = type ?? CoreError.#DEFAULT_TYPE;
    }

    get type() {
        return this.#type;
    }
}
