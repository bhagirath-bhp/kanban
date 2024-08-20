// src/components/Card.js
import React from 'react';
import { motion } from 'framer-motion';
import { handleDragStart } from '../utils/dragUtils';

const Card = ({ title, id, column }) => {
    return (
        <motion.div
            layout
            layoutId={id}
            onDragStart={(e) => handleDragStart(e, { title, id, column })}
            draggable="true"
            className='cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing'
        >
            <p className='text-sm text-neutral-100'>{title}</p>
        </motion.div>
    );
}

export default Card;
