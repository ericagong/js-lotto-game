import { convertToMatchingDataType } from '../converter.js';

export default class PriceInputView {
    #$container = document.querySelector('#main-container');

    constructor({ onSubmit }) {
        this.#render();
        this.#bindSubmit(onSubmit);
    }

    #render() {
        this.#$container.insertAdjacentHTML(
            'beforeend',
            `
            <form id="input-price-form" class="mt-5" aria-labelledby="input-price">
                <label for="input-price" class="mb-2 d-inline-block">구입할 금액을 입력해주세요.</label>
                <div class="d-flex">
                    <input
                        type="number"
                        id="input-price"
                        class="w-100 mr-2 pl-2"
                        name="price"
                        placeholder="구입 금액"
                        required
                        min="1000"
                        max="100000"
                    />
                    <button type="submit" id="input-price-button" class="btn btn-cyan">확인</button>
                </div>
            </form>
        `,
        );
    }

    #getUserInput() {
        return convertToMatchingDataType(document.querySelector('#input-price').value);
    }

    #bindSubmit(onSubmit) {
        document.querySelector('#input-price-form').addEventListener('submit', (event) => {
            event.preventDefault();
            try {
                onSubmit(this.#getUserInput());
            } catch (error) {
                alert(error.message);
            }
        });
    }
}
