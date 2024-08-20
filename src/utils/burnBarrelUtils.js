// src/utils/burnBarrelUtils.js
export const handleBurnBarrelDragOver = (e, setActive) => {
    e.preventDefault();
    setActive(true);
}

export const handleBurnBarrelDragLeave = (e, setActive) => {
    e.preventDefault();
    setActive(false);
}

export const handleBurnBarrelDrop = (e, setCards, setActive) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    setCards(cards => cards.filter(card => card.id !== cardId));
    setActive(false);
}
