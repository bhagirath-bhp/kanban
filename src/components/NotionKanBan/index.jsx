import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'


const NotionKanban = () => {
  return (
    <>
      <div className='h-screen w-full bg-neutral-900 text-neutral-50'>
        <Board />
      </div>
    </>
  )
}

export default NotionKanban

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [hasChecked, setHasChecked] = useState(false);
  useEffect(() => {
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  useEffect(() => {
    const cardData = localStorage.getItem("cards");
    setCards(cardData ? JSON.parse(cardData) : DEFAULT_CARDS);
    setHasChecked(true);
  }, []);
  return (
    <>
      <div className='flex h-full w-full gap-3 overflow-scroll p-12'>
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-neutral-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="TODO"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-blue-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-200"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    </>
  )
}

const Column = ({ title, headingColor, column, cards, setCards }) => {
  const [active, setActive] = useState(false);
  const filteredCards = cards.filter((card) => card.column === column);
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  }
  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  }
  const handleDragLeave = (e) => {
    setActive(false);
    clearHighlights();
  }
  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();
    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();
    const nearestIndicator = getNearestIndicator(e, indicators);
    const beforeId = nearestIndicator.getAttribute("data-before") || "-1";
    
    if(beforeId !== cardId){
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.id === cardId);
      if(!cardToTransfer) return;
      cardToTransfer = {...cardToTransfer, column};
      copy = copy.filter((card) => card.id !== cardId);
      const moveToBack = beforeId === "-1";
      if(moveToBack){
        copy.push(cardToTransfer);
      }
      else{
        const insertAtIndex = copy.findIndex((card) => card.id === beforeId);
        if(insertAtIndex === -1 || undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setCards(copy);
    }
  }
  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearestIndicator = getNearestIndicator(e, indicators);
    nearestIndicator.style.opacity = 1;
  }
  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column=${column}]`));
  }
  const getNearestIndicator = (e, indicators) => {
    return indicators.reduce((nearest, current) => {
      const currentRect = current.getBoundingClientRect();
      const nearestRect = nearest.getBoundingClientRect();
      const currentDiff = Math.abs(currentRect.y - e.clientY);
      const nearestDiff = Math.abs(nearestRect.y - e.clientY);
      return currentDiff < nearestDiff ? current : nearest;
    });
  }
  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((indicator) => {
      indicator.style.opacity = 0;
    });
  }
  return (
    <div className='w-56 shrink-0'>
      <div className="mb3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className='rounded text-sm text-neutral-400'>{filteredCards.length}</span>
      </div>
      <div
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}>
        {filteredCards.map((card) => (
          <Card key={card.id} {...card} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId="-1" column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  )
}

const Card = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        draggable="true"
        className='cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing'>
        <p className='text-sm text-neutral-100'>
          {title}
        </p>
      </motion.div>
    </>
  )
}


const DropIndicator = ({ beforeId, column }) => {
  console.log(beforeId)
  return (
    <div
      data-before={beforeId | "-1"}
      data-column={column}
      className='my-0.5 h-0.5 w-full bg-violet-400 opacity-0'
    />
  );
}

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  }
  const handleDragLeave = (e) => {
    e.preventDefault();
    setActive(false);
  }
  const handleDragEnd = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    setCards((cards) => cards.filter((card) => card.id !== cardId));
    setActive(false);

  }
  return (
    <div className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active ? "border-red-800 bg-red-800/20 text-red-500" : "border-neutral-500 bg-neutral-500/20 text-neutral-500"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
    >
      {active ? "🔥" : "🗑️"}
    </div>
  )
}

const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim().length) return;
    const newCard = {
      title: text,
      id: Date.now().toString(),
      column: column,
    };
    setCards((cards) => [...cards, newCard]);
    setAdding(false);
  }
  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => { setText(e.target.value) }}
            autoFocus
            placeholder='Add new task...'
            className='w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0'
          ></textarea>
          <div className='mt-5 flex items-center justify-end gap-1.5'>
            <button
              onClick={() => { setAdding(false) }}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >Close</button>
            <button
              type='submit'
              className='flex items-center gap-1.5 rounded px-3 py-1.5 text-xs bg-neutral-50 text-neutral-950 transition-colors hover:bg-neutral-300'
            ><span>Add</span></button>
          </div>
        </motion.form>) : (
        <motion.button
          layout
          onClick={() => { setAdding(true) }}
          className='flex w-full items-center gap-1.5 px-3 py-1.5 text-neutral-400 transition-colors hover:text-neutral-50'
        >
          <span>+ Add a card</span>
        </motion.button>)}
    </>
  )
}


const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];