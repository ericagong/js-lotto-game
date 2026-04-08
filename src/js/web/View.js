import {
    priceFormTemplate,
    winningLottoFormTemplate,
    purchasedOutputTemplate,
    statisticsOutputTemplate,
} from './templates.js';

export default class WebView {
    #container = document.querySelector('#main-container');

    #render(html) {
        this.#container.insertAdjacentHTML('beforeend', html);
    }

    #cleanupRenderedAfter($element) {
        while ($element.nextElementSibling) {
            $element.nextElementSibling.remove();
        }
    }

    #enableLottoToggle() {
        const $btn = document.querySelector('#lotto-switch-button');
        $btn.addEventListener('change', (event) => {
            const show = event.target.checked;
            document.querySelectorAll('.lotto-item').forEach(($item) => $item.classList.toggle('w-100', show));
            document.querySelectorAll('.lotto-numbers').forEach(($number) => $number.classList.toggle('none', !show));
        });
    }

    #enableModalClose() {
        document.querySelector('.modal-close').addEventListener('click', () => {
            const $modal = document.querySelector('.modal.open');
            $modal.classList.remove('open');
            $modal.remove();
        });
    }

    #enableResetGame() {
        document.querySelector('#reset-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

    renderPurchaseForm() {
        this.#render(priceFormTemplate());
    }

    renderIssuedLottos(data) {
        this.#render(purchasedOutputTemplate(data));
        this.#enableLottoToggle();
    }

    renderWinningLottoForm() {
        this.#render(winningLottoFormTemplate());
    }

    renderStatistics(data) {
        this.#render(statisticsOutputTemplate(data));
        this.#enableModalClose();
        this.#enableResetGame();
    }

    onPurchaseSubmit(handler) {
        const $form = document.querySelector('#input-price-form');
        $form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.#cleanupRenderedAfter($form);
            const price = Number(document.querySelector('#input-price').value);
            handler(price);
        });
    }

    onWinningLottoSubmit(handler) {
        const $form = document.querySelector('#input-winning-lotto-nums');
        $form.addEventListener('submit', (event) => {
            event.preventDefault();
            const winningNumbers = Array.from(document.querySelectorAll('.winning-number.lotto-number')).map(($el) =>
                Number($el.value),
            );
            const bonusNumber = Number(document.querySelector('.winning-number.bonus-number').value);
            handler({ winningNumbers, bonusNumber });
        });
    }

    alertError(error) {
        alert(error.message);
    }
}
