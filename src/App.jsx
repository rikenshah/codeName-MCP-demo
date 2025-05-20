import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import Sidebar from './components/Sidebar'
import { words } from './components/Board'
import Summary from './components/Summary'

const turns = [
  {
    team: 'Red',
    clue: 'Animal',
    number: 2,
    revealed: [5, 11],
    mcpInsight: 'Clue "Animal" likely refers to Tiger and Mouse. Mouse was a bit of a stretch.'
  },
  {
    team: 'Blue',
    clue: 'Sky',
    number: 2,
    revealed: [2, 8],
    mcpInsight: 'MCP expected Moon and Ocean. Both were correct guesses.'
  },
  {
    team: 'Red',
    clue: 'Heat',
    number: 2,
    revealed: [20, 0],
    mcpInsight: 'Apple is questionable for "Heat". Fire was a solid connection.'
  }
]

function generateCardTypes() {
  const types = [
    ...Array(9).fill('red'),     // 9 red agents
    ...Array(8).fill('blue'),    // 8 blue agents
    ...Array(7).fill('neutral'), // 7 neutrals
    'assassin'                   // 1 assassin
  ]

  // Shuffle
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[types[i], types[j]] = [types[j], types[i]]
  }

  return types
}

function getMcpDeductions(clue) {
  const allCandidates = words.map((word, index) => ({
    word,
    index,
    confidence: Math.random() // just random for now
  }))

  // Sort highest confidence first
  return allCandidates
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [types] = useState(generateCardTypes)
  const [turnIndex, setTurnIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setTurnIndex(prev => {
        if (prev < turns.length - 1) return prev + 1
        setAutoPlay(false)
        setShowSummary(true)
        return prev
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const currentTurn = turns[turnIndex]
  const revealedIndices = turns
    .slice(0, turnIndex + 1)
    .flatMap(t => t.revealed)

  const deduction = getMcpDeductions(currentTurn.clue)
  if (showIntro) {
    return (
      <div className="intro-screen">
        <h1>Codenames x MCP</h1>
        <p>This interactive demo showcases how memory, reasoning, and deduction evolve turn-by-turn in a Codenames game—powered by MCP-like intelligence.</p>
        <p className="author"> - Jaydeep Shah</p>
        <button onClick={() => setShowIntro(false)}>Start Demo</button>
      </div>
    )
  }
  return (
    <div className="App">
      <h1>Codenames MCP Demo</h1>

      {showSummary ? (
        <Summary turns={turns} />
      ) : (
        <div className="main-layout fade-in">
          <Board
            revealedIndices={revealedIndices}
            types={types}
            highlightIndices={currentTurn.revealed}
          />
          <Sidebar
            turn={currentTurn}
            turnIndex={turnIndex}
            maxTurns={turns.length}
            onNext={() =>
              setTurnIndex(i => Math.min(i + 1, turns.length - 1))
            }
            onPrev={() =>
              setTurnIndex(i => Math.max(i - 1, 0))
            }
            autoPlay={autoPlay}
            onPlayToggle={() => setAutoPlay(p => !p)}
            deduction={deduction}
            onShowSummary={() => setShowSummary(true)}
          />
        </div>
      )}
    </div>
  )
}


export default App

