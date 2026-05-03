import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import PhonicsBlocks from "../components/PhonicsBlocks";
import { ALL_JUMBLE_WORDS } from "../data/jumbleWords";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { Lightbulb, RefreshCw, Star, ChevronRight, Shuffle } from "lucide-react";

const ROUND_SIZE = 12;
const pickRound = () => {
  // Shuffle from full 100+ list, prefer mixed lengths
  const arr = ALL_JUMBLE_WORDS.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, ROUND_SIZE);
};

const jumble = (word) => {
  const arr = word.letters.slice();
  for (let i = 0; i < 60; i++) {
    const a = Math.floor(Math.random() * arr.length);
    const b = Math.floor(Math.random() * arr.length);
    [arr[a], arr[b]] = [arr[b], arr[a]];
  }
  return arr.map((ch, i) => ({ id: `${ch}-${i}-${Math.random()}`, ch }));
};

export default function JumbleGame() {
  const [round, setRound] = useState(() => pickRound());
  const [idx, setIdx] = useState(0);
  const [pool, setPool] = useState(() => jumble(round[0]));
  const [picked, setPicked] = useState([]);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = round[idx];
  const target = useMemo(() => cur.letters.join(""), [cur]);

  useEffect(() => {
    setPool(jumble(cur));
    setPicked([]);
    setHint(false);
    speak(`Make the word: ${cur.word}.`);
  }, [idx, cur, speak]);

  const tap = (l) => {
    setPicked((arr) => [...arr, l]);
    setPool((arr) => arr.filter((x) => x.id !== l.id));
    speak(l.ch);
  };
  const undo = (l) => {
    setPicked((arr) => arr.filter((x) => x.id !== l.id));
    setPool((arr) => [...arr, l]);
  };
  const reset = () => { setPool(jumble(cur)); setPicked([]); };
  const skip = () => { if (idx + 1 < round.length) setIdx(idx + 1); else finish(); };

  const finish = () => {
    setDone(true);
    const stars = score >= round.length - 2 ? 3 : score >= round.length / 2 ? 2 : 1;
    recordLevel("jumble", stars);
  };

  const check = () => {
    const guess = picked.map((p) => p.ch).join("");
    if (guess.toUpperCase() === target.toUpperCase()) {
      speak(`Yes! ${cur.word}. Good job!`);
      fireConfetti();
      setScore((s) => s + 1);
      setTimeout(() => {
        if (idx + 1 < round.length) setIdx(idx + 1);
        else finish();
      }, 1100);
    } else {
      speak("Try again!");
    }
  };

  const restartRound = () => {
    setRound(pickRound());
    setIdx(0);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <Layout title="Jumble Master 🔀" testId="jumble-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="text-3xl font-extrabold text-fuchsia-600">Jumble Master!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {round.length}</p>
          <p className="text-slate-500 mt-1 text-sm">Total words available: {ALL_JUMBLE_WORDS.length}</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={restartRound} data-testid="jumble-play-again" className="toy-btn bg-fuchsia-400 text-white px-6 py-3 flex items-center gap-1">
              <Shuffle size={18} /> Play Again
            </button>
            <a href="/levels" className="toy-btn inline-block bg-white text-slate-700 border-slate-200 px-6 py-3">Back to Map</a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Jumble Master 🔀" testId="jumble-game">
      <TeacherMascot message={`Round ${idx + 1} of ${round.length} · 100+ words!`} />
      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-slate-700">Make the word from the picture:</p>
          <TTSButton text={`Make the word: ${cur.word}`} testId={`jumble-tts-${idx}`} size="sm" />
        </div>

        <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
          <img src={cur.img} alt={cur.word} className="w-full h-40 sm:h-52 object-cover" />
        </div>

        <p className="text-center text-slate-500 mt-2 text-sm">
          {target.length} letters {hint ? <>· starts with <b>{target[0]}</b> · {cur.hint}</> : null}
        </p>

        {/* Picked slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 min-h-[64px]">
          {picked.length === 0 ? (
            <span className="text-slate-400">Tap letters below…</span>
          ) : (
            picked.map((l) => (
              <button
                key={l.id}
                onClick={() => undo(l)}
                data-testid={`jumble-picked-${l.id}`}
                className="bg-fuchsia-100 border-2 border-fuchsia-300 rounded-xl w-12 h-14 flex items-center justify-center text-2xl font-extrabold text-fuchsia-700"
              >
                {l.ch}
              </button>
            ))
          )}
        </div>

        {/* Pool */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 bg-fuchsia-50 rounded-2xl p-3 border-2 border-fuchsia-200">
          {pool.map((l) => (
            <button
              key={l.id}
              onClick={() => tap(l)}
              data-testid={`jumble-letter-${l.id}`}
              className="bg-white border-2 border-fuchsia-200 rounded-xl w-12 h-14 flex items-center justify-center text-2xl font-extrabold text-fuchsia-700 shadow-[0_3px_0_0_#E879F9] hover:bg-fuchsia-50 active:translate-y-0.5"
            >
              {l.ch}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <button onClick={() => setHint(true)} data-testid="jumble-hint" className="toy-btn bg-amber-300 text-slate-900 px-4 py-3 flex items-center gap-1">
            <Lightbulb size={18} /> Hint
          </button>
          <button onClick={reset} data-testid="jumble-reset" className="toy-btn bg-white text-slate-700 border-slate-200 px-4 py-3 flex items-center gap-1">
            <RefreshCw size={18} /> Reset
          </button>
          <button onClick={check} data-testid="jumble-check" className="toy-btn bg-emerald-400 text-white px-6 py-3 flex items-center gap-1">
            <Star size={18} /> Check
          </button>
          <button onClick={skip} data-testid="jumble-skip" className="toy-btn bg-slate-100 text-slate-700 border-slate-200 px-4 py-3 flex items-center gap-1">
            Skip <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-center font-bold text-slate-600 mb-1 text-sm">Phonics sound</p>
          <PhonicsBlocks word={cur.word} testId={`jumble-phonics-${idx}`} />
        </div>
      </div>
    </Layout>
  );
}
