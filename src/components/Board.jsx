import React from 'react'
import './Board.css'

export default function Board({ revealedIndices, types, highlightIndices, words, gridDim = 5 }) {
    const cards = words.map((word, i) => ({
        word,
        type: types[i],
        revealed: revealedIndices.includes(i)
    }))

    const handleCardClick = (index) => {
        setCards(prev =>
            prev.map((card, i) =>
                i === index ? { ...card, revealed: true } : card
            )
        )
    }

    return (
        <div className="board" style={{ gridTemplateColumns: `repeat(${gridDim}, 1fr)` }}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`card ${card.revealed ? card.type : ''} ${highlightIndices.includes(index) ? 'highlight' : ''}`}
                >
                    {card.word}
                </div>
            ))}
        </div>
    )
}
