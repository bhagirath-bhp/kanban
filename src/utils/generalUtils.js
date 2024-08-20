// src/utils/localStorageUtils.js
export const getStoredCards = () => {
    const cards = localStorage.getItem('cards');
    return cards ? JSON.parse(cards) : null;
}

export const setStoredCards = (cards) => {
    localStorage.setItem('cards', JSON.stringify(cards));
}
