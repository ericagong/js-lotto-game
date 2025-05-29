const $mainContainer = document.querySelector('#main-container');

export const render = (el, container = $mainContainer) => {
    container.insertAdjacentHTML('beforeend', el);
};
