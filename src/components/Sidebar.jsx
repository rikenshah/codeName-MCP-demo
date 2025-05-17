import React from 'react'
import { words } from './Board'
import './Sidebar.css'

export default function Sidebar({ turn, turnIndex, maxTurns, onNext, onPrev, autoPlay, onPlayToggle, deduction, onShowSummary }) {

    return (
        <div className="sidebar">
            <h2>Turn {turnIndex + 1}</h2>
            <p><strong>Team:</strong> {turn.team}</p>
            <p><strong>Clue:</strong> {turn.clue} ({turn.number})</p>
            <p><strong>Words Revealed:</strong></p>
            <ul>
                {turn.revealed.map(index => (
                    <li key={index}>{words[index]}</li>
                ))}
            </ul>
            <p><strong>MCP Insight:</strong></p>
            <p className="insight">{turn.mcpInsight}</p>
            <p><strong>MCP Deduction:</strong></p>
            <ul className="deduction-list">
                {deduction.map(item => (
                    <li key={item.index}>
                        {item.word} — Confidence: {(item.confidence * 100).toFixed(1)}%
                    </li>
                ))}
            </ul>
            <button onClick={onPrev} disabled={turnIndex === 0}>Previous Turn</button>
            <button onClick={onNext} disabled={turnIndex === maxTurns - 1}>Next Turn</button>
            <button onClick={() => onPlayToggle()}>{autoPlay ? 'Pause' : 'Auto-Play'}</button>
            {turnIndex === maxTurns - 1 && (
                <button onClick={onShowSummary}>Show Summary</button>
            )}
        </div>
    )
}