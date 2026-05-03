import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import { IMG } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { RefreshCw } from "lucide-react";

const PAIRS = [
  { id: "monitor", img: IMG.monitor, label: "Monitor" },
  { id: "cpu", img: IMG.cpu, label: "CPU" },
  { id: "keyboard", img: IMG.keyboard, label: "Keyboard" },
  { id: "mouse", img: IMG.mouse, label: "Mouse" },
  { id: "laptop", img: IMG.laptop, label: "Laptop" },
  { id: "smartphone", img: IMG.smartphone, label: "Smartphone" },
];

const shuffle = (arr) => arr.slice().sort(() => 0.5 - Math.random());

const buildDeck = () => {
  // Pick 6 pairs, duplicate, shuffle
  const round = shuffle(PAIRS).slice(0, 6);
  const deck = [];
  round.forEach((p, i) => {
    deck.push({ key: `${p.id}-a-${i}`, id: p.id, img: p.img, label: p.label });
    deck.push({ key: `${p.id}-b-${i}`, id: p.id, img: p.img, label: p.label });
  });
  return shuffle(deck);
};

export default function MemoryMatch() {
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]); // array of indices currently face-up but unmatched
  const [matched, setMatched] = useState({}); // {id: true}
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  useEffect(() => {
    speak("Find the matching pairs! Tap two cards.");
    // eslint-disable-next-line
  }, []);

  const handleFlip = (idx) => {
    if (flipped.includes(idx) || matched[deck[idx].id]) return;
    if (flipped.length === 2) return;

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].id === deck[b].id) {
        // match
        setTimeout(() => {
          setMatched((m) => ({ ...m, [deck[a].id]: true }));
          setFlipped([]);
          fireConfetti();
          speak(`${deck[a].label}! Match!`);
        }, 600);
      } else {
        // no match
        setTimeout(() => setFlipped([]), 900);
      }
    } else {
      speak(deck[idx].label);
    }
  };

  useEffect(() => {
    if (Object.keys(matched).length === 6 && !done) {
      setDone(true);
      const stars = moves <= 8 ? 3 : moves <= 14 ? 2 : 1;
      recordLevel("memory", stars);
      speak("Wonderful! You matched all the pairs!");
    }
    // eslint-disable-next-line
  }, [matched]);

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched({});
    setMoves(0);
    setDone(false);
  };

  if (done) {
    return (
      <Layout title="Memory Match 🧠" testId="memory-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🧠</div>
          <h2 className="text-3xl font-extrabold text-violet-600">Super Memory!</h2>
          <p className="text-slate-600 mt-2 text-lg">You finished in {moves} moves.</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={restart} data-testid="memory-replay" className="toy-btn bg-violet-400 text-white px-5 py-3 flex items-center gap-1">
              <RefreshCw size={16} /> Play Again
            </button>
            <a href="/levels" className="toy-btn inline-block bg-white text-slate-700 border-slate-200 px-5 py-3">Back to Map</a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Memory Match 🧠" testId="memory-game">
      <TeacherMascot message="Tap two cards to flip them. Find the matching pairs!" />

      <div className="flex items-center justify-between mb-3">
        <span className="bg-violet-100 border-2 border-violet-300 text-violet-700 font-extrabold rounded-full px-3 py-1 text-sm">
          Moves: {moves}
        </span>
        <span className="bg-emerald-100 border-2 border-emerald-300 text-emerald-700 font-extrabold rounded-full px-3 py-1 text-sm">
          Pairs: {Object.keys(matched).length} / 6
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {deck.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched[card.id];
          return (
            <button
              key={card.key}
              onClick={() => handleFlip(i)}
              data-testid={`memory-card-${i}`}
              disabled={matched[card.id]}
              className={`aspect-[3/4] rounded-2xl border-4 ${matched[card.id] ? "border-emerald-400 opacity-70" : "border-violet-300"} shadow-md hover:-translate-y-0.5 transition-all`}
              style={{ perspective: "1000px" }}
            >
              <div
                className={`w-full h-full rounded-xl overflow-hidden ${isFlipped ? "bg-white" : "bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center"}`}
              >
                {isFlipped ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1">
                    <img src={card.img} alt={card.label} className="w-full h-3/4 object-cover rounded-lg" />
                    <span className="text-xs font-bold text-slate-700 mt-1">{card.label}</span>
                  </div>
                ) : (
                  <span className="text-4xl text-white">❓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Layout>
  );
}
