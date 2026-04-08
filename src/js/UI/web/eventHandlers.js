const setToggleLottoNumbers = () => {
    const $lottoSwitchButton = document.querySelector('#lotto-switch-button');

    const onToggle = (event) => {
        const showNumbers = event.target.checked;

        document.querySelectorAll('.lotto-item').forEach(($item) => {
            $item.classList.toggle('w-100', showNumbers);
        });

        document.querySelectorAll('.lotto-numbers').forEach(($number) => {
            $number.classList.toggle('none', !showNumbers);
        });
    };

    $lottoSwitchButton.addEventListener('change', onToggle);
};

const setToggleModal = () => {
    const $modalCloseButton = document.querySelector('.modal-close');

    const onToggle = () => {
        const $modal = document.querySelector('.modal.open');
        $modal.classList.remove('open');
        $modal.remove();
    };

    $modalCloseButton.addEventListener('click', onToggle);
};

const setResetGame = () => {
    const $resetButton = document.querySelector('#reset-btn');

    const onReset = () => {
        window.location.reload();
    };

    $resetButton.addEventListener('click', onReset);
};

export const setPurchasedStateEvents = () => {
    setToggleLottoNumbers();
};

export const setWinningNumbersStateEvents = () => {
    setToggleModal();
    setResetGame();
};
