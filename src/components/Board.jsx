import React from 'react'
import './Board.css'

export const words = [
    'Apple', 'River', 'Moon', 'Train', 'Glass',
    'Tiger', 'Book', 'Star', 'Ocean', 'Chair',
    'Sun', 'Mouse', 'Tree', 'Gold', 'Plane',
    'King', 'Phone', 'Snow', 'Bridge', 'Fish',
    'Fire', 'Ring', 'Eye', 'Cloud', 'Key'
]

export default function Board({ revealedIndices, types, highlightIndices }) {
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
        <div className="board">
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
