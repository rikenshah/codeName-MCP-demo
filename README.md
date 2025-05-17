# Codenames x MCP Demo

A visually rich and interactive walkthrough showcasing how **MCP (Memory-Context Processor)** transforms multi-turn decision-making and contextual reasoning, using the classic party game **Codenames** as a practical example.

---

## 🧠 What is MCP?

**MCP (Memory-Context Processor)** is a model-layer framework designed to provide AI systems with persistent memory, stateful reasoning, and long-horizon contextual awareness across multiple user interactions.

### ✅ Why was MCP developed?

Traditional LLMs, even the most advanced ones, treat every query as stateless. They forget prior conversation turns unless they’re passed again, and they fail to truly "reason" over time.

MCP was developed to:

* Retain evolving **user goals and progress**
* Preserve a **timeline of decisions** and model responses
* Maintain **semantic and logical continuity** over a session

Imagine working with an AI that doesn’t forget — that remembers your goal from turn 1, understands how turn 4 affects turn 7, and adjusts its logic based on what’s already occurred. That’s MCP.

> Think of MCP as a living memory layer for AI — like a whiteboard the model updates and reasons with across time.

---

## 🤔 Why this demo?

We needed a way to demonstrate how powerful MCP’s persistent memory and logical continuity can be — especially in situations where history affects future decisions.

Enter **Codenames**: a game of clues, guesses, and progressive team reasoning. It’s the perfect metaphor.

In a non-MCP system, the AI:

* Forgets previous clues
* Can’t evaluate the game board’s evolving state
* Makes isolated, non-contextual suggestions

With **MCP**, the AI:

* Tracks every move, clue, and guess
* Learns what worked and what failed
* Builds memory-informed reasoning chains
* Adjusts dynamically as context evolves

This demo visually and interactively shows that transformation.

---

## 🎮 What this demo includes

| Feature                 | Description                                                            |
| ----------------------- | ---------------------------------------------------------------------- |
| 🎯 5x5 Word Grid        | Realistic Codenames-style game board                                   |
| 🧠 MCP Memory Panel     | Shows team, clue, guesses, insights, and memory state                  |
| 🔎 Deduction Simulation | Shows what MCP "thinks" a clue might relate to, with confidence levels |
| ⏮️ Turn Navigation      | Step forward/back to see evolving game state and logic                 |
| ▶️ Auto-Play Mode       | Sit back and watch MCP progress across all turns                       |
| 🧾 Game Summary View    | A horizontally laid-out recap of all turns and MCP insights            |

---

## 🖼 Screenshots

*(Feel free to replace these paths with real screenshots after deployment)*

**Main Game Board:**
![Main Board](screenshots/game-board.png)

**MCP Memory Panel:**
![Sidebar](screenshots/sidebar-memory.png)

**Game Summary View:**
![Summary](screenshots/summary-cards.png)

---

## 🔍 MCP vs Non-MCP Systems

| Capability              | Without MCP                    | With MCP                            |
| ----------------------- | ------------------------------ | ----------------------------------- |
| Track history           | ❌ Remembers only current input | ✅ Persistent multi-turn memory      |
| Logical progression     | ❌ Clues treated as isolated    | ✅ Clues build on prior logic        |
| Mistake recovery        | ❌ Ignores past missteps        | ✅ Learns from earlier wrong guesses |
| Realistic team modeling | ❌ Flat reasoning per turn      | ✅ Strategy evolves like a teammate  |

---

## 📦 Tech Stack

* **React + Vite**: Lightning-fast frontend
* **Vanilla CSS**: Clean, responsive styling
* **State Hooks**: For timeline, memory, and logic
* **GitHub Pages Ready**: Deploy in seconds

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

* Be sure to update `base` in `vite.config.js` to match your repo name

---

## 🧼 Codebase Polished For Demo Use

* No Vite/React branding or boilerplate
* Custom intro screen and transitions
* Clear modular layout for reuse or extension

---

## 👏 Credits

This project was created to illustrate how MCP makes even games smarter — let alone real-world decision-making flows.

Designed and developed by Jaydeep Shah, powered by OpenAI’s architecture and guidance.

---

⚠️ Originally conceptualized as “Model Context Protocol,” this project evolved to showcase the Memory-Context Processor—but the vision behind both remains aligned: multi-turn reasoning, state tracking, and dynamic contextual intelligence.


## 📄 License

MIT License — free to modify, fork, and use in personal or commercial projects.

---

## 💬 Feedback or Contributions

Have suggestions, improvements, or want to contribute logic modules? Open an issue or start a discussion on GitHub.

