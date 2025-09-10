import { useEffect, useRef, useState, memo } from "react";
import "../styles/MemoryGame.css";

type Difficulty = "easy" | "normal" | "hard";

// --- Emoji sets por dificultad ---
const EMOJIS = [
    "🍕", "🍔", "🍟", "🌮", "🍣", "🍩", "🍪", "🍫", "🍓", "🍉",
    "🍒", "🍇", "🍍", "🥑", "🥕", "🌽", "🍄", "🧀", "🥐", "🥨",
    "☕️", "🍵", "🧋", "🍺", "🍷", "🍸", "🍹", "🍰", "🧁", "🥞",
];

type Card = {
    id: number;
    pairId: number;
    emoji: string;
    flipped: boolean;
    matched: boolean;
};

const DIFF_PAIRS: Record<Difficulty, number> = {
    easy: 6,     // 12 cartas
    normal: 9,   // 18 cartas
    hard: 12,    // 24 cartas
};

type CardGridProps = {
    cards: Card[];
    difficulty: Difficulty;
    onFlip: (idx: number) => void;
};

const CardGrid = memo(function CardGrid({ cards, difficulty, onFlip }: CardGridProps) {
    return (
        <div className="container">
            <ul
                className="list-unstyled m-0"
                style={{
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns:
                        difficulty === "easy"
                            ? "repeat(4, 1fr)"
                            : difficulty === "normal"
                                ? "repeat(6, 1fr)"
                                : "repeat(8, 1fr)",
                    width: "100%",
                    maxWidth: "1000px",
                    margin: "0 auto",
                }}
            >
                {cards.map((card, idx) => (
                    <li
                        key={card.id}
                        onClick={() => onFlip(idx)}
                        style={{ cursor: "pointer", perspective: "1000px" }}
                    >
                        <div className={`card-inner ${card.flipped ? "flipped" : ""}`}>
                            <div className="card-front">?</div>
                            <div className="card-back">{card.emoji}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});

function MemoryGame() {


    const [difficulty, setDifficulty] = useState<Difficulty>("normal");
    const [cards, setCards] = useState<Card[]>([]);
    const [firstIndex, setFirstIndex] = useState<number | null>(null);
    const [secondIndex, setSecondIndex] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [lockBoard, setLockBoard] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const handleVis = () => {
            if (document.hidden) stopTimer();
            else startTimer();
        };
        document.addEventListener('visibilitychange', handleVis);
        return () => document.removeEventListener('visibilitychange', handleVis);
    }, []);

    useEffect(() => {
        return () => stopTimer(); // cleanup on unmount
    }, []);

    function resetGame(d: Difficulty = difficulty) {
        const pairs = DIFF_PAIRS[d] || 6;
        const selectedCards = EMOJIS.slice(0, pairs);
        const pairsCards: Card[] = [];

        // Reset UI state
        setFirstIndex(null);
        setSecondIndex(null);
        setMoves(0);
        setSeconds(0);
        setLockBoard(false);
        setMessage(null);

        // Build deck: two cards per pair with the same pairId and unique ids
        selectedCards.forEach((emoji, index) => {
            pairsCards.push({ id: index * 2, emoji, flipped: false, matched: false, pairId: index });
            pairsCards.push({ id: index * 2 + 1, emoji, flipped: false, matched: false, pairId: index });
        });

        const shuffledPairs = shuffle(pairsCards);
        setCards(shuffledPairs);

        // Setup timer
        stopTimer();
        setSeconds(0);
        startTimer();
    }

    function startTimer() {
        if (timerRef.current !== null) return; // ya está corriendo
        timerRef.current = window.setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);
    }

    function stopTimer() {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    function changeDifficulty(newDifficulty: Difficulty) {
        setDifficulty(newDifficulty);
        resetGame(newDifficulty);
    }
    useEffect(() => {
        // initialize deck on first render
        if (cards.length === 0) {
            resetGame(difficulty);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function shuffle<T>(array: T[]): T[] {
        const arrayCopy = array.slice()
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }

        return arrayCopy;
    }

    function flipCard(idx: number) {
        const current = cards[idx];
        if (lockBoard || current.flipped || current.matched) return;

        // First selection
        if (firstIndex === null) {
            setFirstIndex(idx);
            const next = cards.slice();
            next[idx] = { ...current, flipped: true };
            setCards(next);
            return;
        }

        // Second selection
        if (secondIndex === null) {
            setLockBoard(true);
            setSecondIndex(idx);

            const next = cards.slice();
            next[idx] = { ...current, flipped: true };
            setCards(next);

            // capture indices locally for use inside the branches/timeouts
            const i = firstIndex;
            const j = idx;
            const first = next[i];
            const second = next[j];

            if (first.pairId === second.pairId) {
                const updated = next.slice();
                updated[i] = { ...first, flipped: true, matched: true };
                updated[j] = { ...second, flipped: true, matched: true };
                setCards(updated);

                if (updated.every(c => c.matched)) {
                    stopTimer();
                    setMessage(`🎉 Congratulations! You completed the game in ${moves + 1} moves and ${seconds} seconds.`);
                }

                setMoves(m => m + 1);
                setFirstIndex(null);
                setSecondIndex(null);
                setLockBoard(false);
            } else {
                setTimeout(() => {
                    const reverted = next.slice();
                    reverted[i] = { ...reverted[i], flipped: false };
                    reverted[j] = { ...reverted[j], flipped: false };
                    setCards(reverted);

                    setMoves(m => m + 1);
                    setFirstIndex(null);
                    setSecondIndex(null);
                    setLockBoard(false);
                }, 1000);
            }

            return;
        }

        // already had two selected; ignore
        return;
    }


    return (
        <div>
            <h1>Memory Game</h1>
            <button className="btn btn-primary mb-3" onClick={() => resetGame(difficulty)}>Reset Game</button>
            <div className="mb-3">
                <label htmlFor="difficultySelect" className="form-label">Select Difficulty:</label>
                <select
                    id="difficultySelect"
                    className="form-select w-auto"
                    value={difficulty}
                    onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
                >
                    <option value="easy">Easy (12 cards)</option>
                    <option value="normal">Normal (18 cards)</option>
                    <option value="hard">Hard (24 cards)</option>
                </select>
            </div>
            <div className="mb-3">
                <strong>Moves:</strong> {moves} | <strong>Time:</strong> {seconds} seconds
            </div>
            {message && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    tabIndex={-1}
    role="dialog"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">🎉 Congratulations!</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          ></button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMessage(null)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setMessage(null);
              resetGame(difficulty);
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
)}
            <CardGrid cards={cards} difficulty={difficulty} onFlip={flipCard} />
        </div>
    )
}


export default MemoryGame;