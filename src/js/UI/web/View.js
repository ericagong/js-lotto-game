import { priceFormTemplate, winningLottoFormTemplate } from './formTemplates.js';
import { purchasedOutputTemplate, statisticsOutputTemplate } from './outputTemplates.js';
import { convertToMatchingDataType } from '../converter.js';

export default class WebView {
    #mainContainer = document.querySelector('#main-container');
    #appContainer = document.querySelector('#app');

    #display(html, container = this.#mainContainer) {
        container.insertAdjacentHTML('beforeend', html);
    }

    showPurchaseForm() {
        this.#display(priceFormTemplate());
    }

    showWinningLottoForm() {
        this.#display(winningLottoFormTemplate());
    }

    onPurchaseSubmit(handler) {
        const $form = document.querySelector('#input-price-form');
        $form.addEventListener('submit', (event) => {
            event.preventDefault();
            const price = convertToMatchingDataType(document.querySelector('#input-price').value);
            handler(price);
        });
    }

    onWinningLottoSubmit(handler) {
        const $form = document.querySelector('#input-winning-lotto-nums');
        $form.addEventListener('submit', (event) => {
            event.preventDefault();
            const winningNumbers = Array.from(
                document.querySelectorAll('.winning-number.lotto-number'),
            ).map(($el) => convertToMatchingDataType($el.value));
            const bonusNumber = convertToMatchingDataType(
                document.querySelector('.winning-number.bonus-number').value,
            );
            handler({ winningNumbers, bonusNumber });
        });
    }

    showIssuedLottos(data) {
        this.#display(purchasedOutputTemplate(data));
        this.#bindLottoToggle();
    }

    showStatistics(data) {
        this.#display(statisticsOutputTemplate(data), this.#appContainer);
        this.#bindModalClose();
        this.#bindResetGame();
    }

    showError(error) {
        alert(error.message);
    }

    #bindLottoToggle() {
        const $btn = document.querySelector('#lotto-switch-button');
        $btn.addEventListener('change', (event) => {
            const show = event.target.checked;
            document
                .querySelectorAll('.lotto-item')
                .forEach(($item) => $item.classList.toggle('w-100', show));
            document
                .querySelectorAll('.lotto-numbers')
                .forEach(($number) => $number.classList.toggle('none', !show));
        });
    }

    #bindModalClose() {
        document.querySelector('.modal-close').addEventListener('click', () => {
            const $modal = document.querySelector('.modal.open');
            $modal.classList.remove('open');
            $modal.remove();
        });
    }

    #bindResetGame() {
        document.querySelector('#reset-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}
