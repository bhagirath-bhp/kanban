// src/components/Board.js
import React, { useEffect, useState } from 'react';
import Column from '../Column';
import BurnBarrel from '../BurnBarrel';
import { DEFAULT_CARDS } from '../../constants/defaultCards';
import { getStoredCards, setStoredCards } from '../../utils/generalUtils';

const Board = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);

    useEffect(() => {
        const initialCards = getStoredCards() || DEFAULT_CARDS;
        setCards(initialCards);
    }, []);

    useEffect(() => {
        setStoredCards(cards);
    }, [cards]);

    return (
        <div className='flex h-full w-full gap-3 overflow-scroll p-12'>
            {['backlog', 'todo', 'doing', 'done'].map((col) => (
                <Column
                    key={col}
                    title={capitalizeFirstLetter(col)}
                    column={col}
                    headingColor={getColumnColor(col)}
                    cards={cards}
                    setCards={setCards}
                />
            ))}
            <BurnBarrel setCards={setCards} />
        </div>
    );
}

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getColumnColor = (column) => {
    const colors = {
        backlog: 'text-neutral-500',
        todo: 'text-yellow-200',
        doing: 'text-blue-200',
        done: 'text-emerald-200',
    };
    return colors[column];
}

export default Board;
