// src/components/Column.js
import React, { useState } from 'react';
import Card from '../Card';
import DropIndicator from '../DropIndicator';
import AddCard from '../AddCard';
import { handleDragOver, handleDragLeave, handleDragEnd } from '../../utils/dragUtils';

const Column = ({ title, headingColor, column, cards, setCards }) => {
    const [active, setActive] = useState(false);
    const filteredCards = cards.filter(card => card.column === column);

    return (
        <div className='w-56 shrink-0'>
            <ColumnHeader title={title} headingColor={headingColor} count={filteredCards.length} />
            <ColumnBody
                active={active}
                setActive={setActive}
                column={column}
                cards={filteredCards}
                setCards={setCards}
            />
        </div>
    );
}

const ColumnHeader = ({ title, headingColor, count }) => (
    <div className="mb3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className='rounded text-sm text-neutral-400'>{count}</span>
    </div>
);

const ColumnBody = ({ active, setActive, column, cards, setCards }) => (
    <div
        onDragOver={(e) => handleDragOver(e, setActive)}
        onDragLeave={(e) => handleDragLeave(e, setActive)}
        onDrop={(e) => handleDragEnd(e, column, cards, setCards)}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
    >
        {cards.map(card => (
            <Card key={card.id} {...card} />
        ))}
        <DropIndicator beforeId="-1" column={column} />
        <AddCard column={column} setCards={setCards} />
    </div>
);

export default Column;
