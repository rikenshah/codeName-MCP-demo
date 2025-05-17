import React from 'react'
import './Summary.css'
import { words } from './Board'

export default function Summary({ turns }) {
    return (
        <div className="summary">
            <h2>Game Summary</h2>
            {turns.map((turn, i) => (
                <div key={i}
                    className={`turn-card ${turn.team.toLowerCase()}`}
                    style={{ '--i': i }}
                >
                    <h3>Turn {i + 1} — <span className="team">{turn.team}</span></h3>
                    <p><strong>Clue:</strong> <em>{turn.clue}</em> ({turn.number})</p>
                    <p><strong>Words Revealed:</strong></p>
                    <ul>
                        {turn.revealed.map(index => (
                            <li key={index}>{words[index]}</li>
                        ))}
                    </ul>
                    <p><strong>MCP Insight:</strong></p>
                    <p className="insight">{turn.mcpInsight}</p>
                </div>
            ))}
        </div>
    )
}
