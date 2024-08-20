// src/components/BurnBarrel.js
import React, { useState } from 'react';
import { handleBurnBarrelDragOver, handleBurnBarrelDragLeave, handleBurnBarrelDrop } from '../utils/burnBarrelUtils';

const BurnBarrel = ({ setCards }) => {
    const [active, setActive] = useState(false);

    return (
        <div
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active ? "border-red-800 bg-red-800/20 text-red-500" : "border-neutral-500 bg-neutral-500/20 text-neutral-500"}`}
            onDragOver={(e) => handleBurnBarrelDragOver(e, setActive)}
            onDragLeave={(e) => handleBurnBarrelDragLeave(e, setActive)}
            onDrop={(e) => handleBurnBarrelDrop(e, setCards, setActive)}
        >
            {active ? "🔥" : "🗑️"}
        </div>
    );
}

export default BurnBarrel;
