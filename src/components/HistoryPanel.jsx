import React from 'react';
import './Summary.css';

export default function HistoryPanel({ turns, words, mcpEnabled }) {
  return (
    <div className="summary" style={{ marginTop: 32 }}>
      <h2>Game History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Turn</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Team</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Clue</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Guesses</th>
          </tr>
        </thead>
        <tbody>
          {turns.map((turn, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#f8f8f8' : 'white' }}>
              <td style={{ padding: 8 }}>{i + 1}</td>
              <td style={{ padding: 8 }}>{turn.team}</td>
              <td style={{ padding: 8 }}>{turn.clue} ({turn.number})</td>
              <td style={{ padding: 8 }}>
                {turn.revealed.map((idx, j) => {
                  const isRepeat = !mcpEnabled && turn.repeatedGuesses && turn.repeatedGuesses.includes(idx);
                  return (
                    <span key={j} style={{
                      color: isRepeat ? '#e74c3c' : '#222',
                      fontWeight: isRepeat ? 'bold' : 'normal',
                      background: isRepeat ? '#ffeaea' : 'none',
                      borderRadius: 4,
                      padding: isRepeat ? '2px 6px' : undefined,
                      marginRight: 6
                    }}>
                      {words[idx]}{isRepeat ? ' (repeat)' : ''}
                    </span>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!mcpEnabled && (
        <div style={{ color: '#e74c3c', marginTop: 12, fontStyle: 'italic' }}>
          In non-MCP mode, repeated guesses are highlighted to show lack of memory.
        </div>
      )}
    </div>
  );
} 