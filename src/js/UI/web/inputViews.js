// input form
export const priceFormRenderer = () => `
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
`;

export const winningLottoFormRenderer = () =>
    `<form class="mt-9" id="input-winning-lotto-nums" aria-labelledby="input-winning-numbers">
        <label id="input-winning-numbers" class="flex-auto d-inline-block mb-3">
            지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.
        </label>
        <div class="d-flex">
            <div>
                <p class="mt-0 mb-3 text-center font-bold">당첨 번호</p>
                <div>
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-1"
                        data-index-num="0"
                        required
                        min="1"
                        max="45"
                    />
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-2"
                        data-index-num="1"
                        required
                        min="1"
                        max="45"
                    />
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-3"
                        data-index-num="2"
                        required
                        min="1"
                        max="45"
                    />
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-4"
                        data-index-num="3"
                        required
                        min="1"
                        max="45"
                    />
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-5"
                        data-index-num="4"
                        required
                        min="1"
                        max="45"
                    />
                    <input
                        type="number"
                        class="winning-number lotto-number mx-1 text-center"
                        aria-label="winning-number-6"
                        data-index-num="5"
                        required
                        min="1"
                        max="45"
                    />
                </div>
            </div>
            <div class="bonus-number-container flex-grow">
                <p class="mt-0 mb-3 text-center font-bold">보너스 번호</p>
                <div class="d-flex justify-center">
                    <input
                        type="number"
                        class="winning-number bonus-number text-center"
                        aria-label="winning-number-bounus"
                        data-index-num="6"
                        required
                        min="1"
                        max="45"
                    />
                </div>
            </div>
        </div>
        <button
            type="submit"
            id="show-result-btn"
            class="open-result-modal-button mt-5 btn btn-cyan w-100"
        >
            결과 확인하기
        </button>
    </form>
`;
