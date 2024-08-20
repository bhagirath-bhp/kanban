// src/utils/dragUtils.js
export const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
}

export const handleDragOver = (e, setActive) => {
    e.preventDefault();
    setActive(true);
}

export const handleDragLeave = (e, setActive) => {
    e.preventDefault();
    setActive(false);
}

export const handleDragEnd = (e, column, cards, setCards) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const card = cards.find(card => card.id === cardId);
    if (!card) return;

    setCards(cards => cards.map(c => c.id === cardId ? { ...c, column } : c));
    setActive(false);
}
