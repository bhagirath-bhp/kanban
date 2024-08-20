// src/components/AddCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddCard = ({ column, setCards }) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const newCard = {
            title: text,
            id: Date.now().toString(),
            column,
        };
        setCards(cards => [...cards, newCard]);
        setAdding(false);
    };

    return adding ? (
        <CardForm handleSubmit={handleSubmit} setText={setText} setAdding={setAdding} />
    ) : (
        <AddCardButton setAdding={setAdding} />
    );
}

const CardForm = ({ handleSubmit, setText, setAdding }) => (
    <motion.form layout onSubmit={handleSubmit}>
        <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder='Add new task...'
            className='w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0'
        />
        <div className='mt-5 flex items-center justify-end gap-1.5'>
            <button
                type='button'
                onClick={() => setAdding(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
                Close
            </button>
            <button
                type='submit'
                className='flex items-center gap-1.5 rounded px-3 py-1.5 text-xs bg-neutral-50 text-neutral-950 transition-colors hover:bg-neutral-300'
            >
                <span>Add</span>
            </button>
        </div>
    </motion.form>
);

const AddCardButton = ({ setAdding }) => (
    <motion.button
        layout
        onClick={() => setAdding(true)}
        className='flex w-full items-center gap-1.5 px-3 py-1.5 text-neutral-400 transition-colors hover:text-neutral-50'
    >
        <span>+ Add a card</span>
    </motion.button>
);

export default AddCard;
