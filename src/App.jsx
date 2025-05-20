import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import Sidebar from './components/Sidebar'
import Summary from './components/Summary'
import { simpleWords } from './simpleWords'

const BOARD_SIZE = 9;
const GRID_DIM = 3;
const TEAM_ORDER = ['Red', 'Blue']; // Alternate turns
const CARD_TYPE_COUNTS = { red: 3, blue: 3, neutral: 2, assassin: 1 };

function generateCardTypes() {
  const types = [
    ...Array(CARD_TYPE_COUNTS.red).fill('red'),
    ...Array(CARD_TYPE_COUNTS.blue).fill('blue'),
    ...Array(CARD_TYPE_COUNTS.neutral).fill('neutral'),
    ...Array(CARD_TYPE_COUNTS.assassin).fill('assassin')
  ];
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}

function getRandomSimpleWords(n) {
  const arr = [...simpleWords];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n).map(w => w.charAt(0).toUpperCase() + w.slice(1));
}

async function fetchClueDatamuse(words) {
  if (!words.length) return 'Random';
  const query = words.slice(0, 3).join(',');
  const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=1`);
  const data = await res.json();
  if (data.length > 0) return data[0].word.charAt(0).toUpperCase() + data[0].word.slice(1);
  return words[0];
}

function getMcpDeductions(words, clue, revealedIndices, n) {
  // Simulate deduction: pick highest confidence among unrevealed
  const allCandidates = words.map((word, index) => ({
    word,
    index,
    confidence: Math.random()
  }));
  return allCandidates
    .filter(c => !revealedIndices.includes(c.index))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, n);
}

function getStatelessGuesses(words, revealedIndices, n) {
  const unrevealed = words.map((_, i) => i).filter(i => !revealedIndices.includes(i));
  return unrevealed.slice(0, n);
}

function getMcpGuesses(words, clue, revealedIndices, n) {
  return getMcpDeductions(words, clue, revealedIndices).slice(0, n).map(c => c.index)
}

function getStatelessGuessesWithRepeats(words, revealedIndices, n) {
  // Stateless: pick random words, possibly including already revealed (simulate lack of memory)
  const indices = []
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * words.length)
    indices.push(idx)
  }
  return indices
}

async function getStatelessGuessesDatamuse(words, clue, n) {
  const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(clue)}&max=10`);
  const data = await res.json();
  const ranked = words.map((w, idx) => {
    const found = data.findIndex(d => d.word.toLowerCase() === w.toLowerCase());
    return { idx, rank: found === -1 ? 999 : found };
  });
  ranked.sort((a, b) => a.rank - b.rank);
  return ranked.slice(0, n).map(r => r.idx);
}

function getTeamIndices(types, team, revealed) {
  return types
    .map((t, idx) => (team === 'Red' && t === 'red') || (team === 'Blue' && t === 'blue') ? idx : null)
    .filter(idx => idx !== null && !revealed.includes(idx));
}

async function buildTurnsDynamic(words, types, mcpEnabled) {
  let revealed = [];
  let turns = [];
  let winner = null;
  let assassinRevealed = false;
  let teamWordsLeft = { red: CARD_TYPE_COUNTS.red, blue: CARD_TYPE_COUNTS.blue };
  let turnNum = 0;
  while (!winner && !assassinRevealed && turnNum < 20) {
    const team = TEAM_ORDER[turnNum % 2];
    const number = 2; // Always 2 guesses per turn for simplicity
    const teamIndices = getTeamIndices(types, team, revealed);
    const teamWords = teamIndices.map(idx => words[idx]);
    const clue = await fetchClueDatamuse(teamWords);
    let guessIndices, repeated = [], deductionList = [];
    if (mcpEnabled) {
      const deduction = getMcpDeductions(words, clue, revealed, 4); // Get top 4
      guessIndices = deduction.slice(0, 2).map(c => c.index); // Use top 2 for guesses
      deductionList = deduction;
    } else {
      guessIndices = await getStatelessGuessesDatamuse(words, clue, number);
      repeated = guessIndices.filter(idx => revealed.includes(idx));
    }
    let assassinHit = false;
    let correct = 0;
    for (const idx of guessIndices) {
      if (revealed.includes(idx)) continue;
      revealed.push(idx);
      if (types[idx] === 'assassin') {
        assassinHit = true;
        break;
      }
      if ((team === 'Red' && types[idx] === 'red') || (team === 'Blue' && types[idx] === 'blue')) {
        correct++;
        teamWordsLeft[types[idx]]--;
      }
    }
    turns.push({
      team,
      clue,
      number,
      revealed: guessIndices,
      mcpInsight: mcpEnabled
        ? `Selected because these words have the highest simulated confidence for the clue "${clue}" among unrevealed words.`
        : undefined,
      mcpDeduction: mcpEnabled ? deductionList : undefined,
      repeatedGuesses: repeated,
      assassinHit,
      correct
    });
    if (assassinHit) {
      winner = team === 'Red' ? 'Blue' : 'Red';
      assassinRevealed = true;
    } else if (teamWordsLeft.red === 0) {
      winner = 'Red';
    } else if (teamWordsLeft.blue === 0) {
      winner = 'Blue';
    }
    turnNum++;
  }
  return { turns, winner, assassinRevealed };
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [types, setTypes] = useState([]);
  const [words, setWords] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mcpEnabled, setMcpEnabled] = useState(true);
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState(null);
  const [assassinRevealed, setAssassinRevealed] = useState(false);

  async function setupGame(mcpMode) {
    setLoading(true);
    const w = getRandomSimpleWords(BOARD_SIZE);
    const t = generateCardTypes();
    setWords(w);
    setTypes(t);
    const { turns: ts, winner: win, assassinRevealed: assassin } = await buildTurnsDynamic(w, t, mcpMode);
    setTurns(ts);
    setWinner(win);
    setAssassinRevealed(assassin);
    setTurnIndex(0);
    setShowSummary(false);
    setLoading(false);
  }

  useEffect(() => {
    setupGame(mcpEnabled);
    // eslint-disable-next-line
  }, []);

  function handleToggleMcp() {
    setMcpEnabled(e => {
      const next = !e;
      setupGame(next);
      return next;
    });
  }

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setTurnIndex(prev => {
        if (prev < turns.length - 1) return prev + 1;
        setAutoPlay(false);
        setShowSummary(true);
        return prev;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [autoPlay, turns.length]);

  if (showIntro) {
    return (
      <div className="intro-screen">
        <h1>Codenames x MCP</h1>
        <p>This interactive demo showcases how memory, reasoning, and deduction evolve turn-by-turn in a Codenames game—powered by MCP-like intelligence.</p>
        <p className="author"> - Jaydeep Shah</p>
        <button onClick={() => setShowIntro(false)}>Start Demo</button>
      </div>
    );
  }

  if (loading || !words.length || !types.length || !turns.length) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>Loading game...</div>;
  }

  const currentTurn = turns[turnIndex];
  const revealedIndices = turns
    .slice(0, turnIndex + 1)
    .flatMap(t => t.revealed);

  const deduction = getMcpDeductions(words, currentTurn.clue, revealedIndices, 5);
  return (
    <div className="App">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <h1 style={{ marginBottom: 0 }}>Codenames MCP Demo</h1>
        <button
          style={{ marginLeft: 24, padding: '8px 18px', fontWeight: 600, fontSize: '1rem', background: mcpEnabled ? '#3498db' : '#888', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', height: 40 }}
          onClick={handleToggleMcp}
        >
          MCP: {mcpEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="main-layout fade-in">
        <Board
          revealedIndices={revealedIndices}
          types={types}
          highlightIndices={currentTurn.revealed}
          words={words}
          gridDim={GRID_DIM}
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
          deduction={currentTurn.mcpDeduction || []}
          onShowSummary={() => setShowSummary(true)}
          mcpEnabled={mcpEnabled}
          words={words}
        />
      </div>
      <Summary turns={turns.slice(0, turnIndex + 1)} mcpEnabled={mcpEnabled} words={words} />
      {((showSummary || turnIndex === turns.length - 1) && winner) && (
        <div style={{ background: '#fff', borderRadius: 8, margin: '32px auto', maxWidth: 500, padding: 24, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
          <h2>Game Over</h2>
          <p><strong>Winner:</strong> {winner} {assassinRevealed ? '(by Assassin)' : ''}</p>
          <p><strong>Total Turns:</strong> {turns.length}</p>
        </div>
      )}
    </div>
  );
}

export default App

