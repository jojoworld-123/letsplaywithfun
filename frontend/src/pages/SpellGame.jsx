import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import PhonicsBlocks from "../components/PhonicsBlocks";
import { ALL_JUMBLE_WORDS } from "../data/jumbleWords";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { Lightbulb, RefreshCw, Star } from "lucide-react";

const pickRound = () => {
  return ALL_JUMBLE_WORDS
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 12);
};

const shuffleLetters = (word) => {
  const arr = word.letters.slice();

  for (let i = 0; i < 50; i++) {
    const a = Math.floor(Math.random() * arr.length);
    const b = Math.floor(Math.random() * arr.length);

    [arr[a], arr[b]] = [arr[b], arr[a]];
  }

  return arr.map((ch, i) => ({
    id: `${ch}-${i}`,
    ch,
  }));
};

export default function SpellGame() {
  const [round] = useState(() => pickRound());
  const [idx, setIdx] = useState(0);

  const [pool, setPool] = useState(() =>
    shuffleLetters(round[0])
  );

  const [picked, setPicked] = useState([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = round[idx];

  const target = useMemo(
    () => cur.letters.join(""),
    [cur]
  );

  const guess = picked.map((p) => p.ch).join("");

  useEffect(() => {
    setPool(shuffleLetters(cur));
    setPicked([]);
    setHintShown(false);

    const timer = setTimeout(() => {
      speak(`Spell the word: ${cur.word}.`);
    }, 100);

    return () => clearTimeout(timer);
  }, [idx]);

  const tap = (l) => {
    setPicked((arr) => [...arr, l]);

    setPool((arr) =>
      arr.filter((x) => x.id !== l.id)
    );

    speak(l.ch);
  };

  const undo = (l) => {
    setPicked((arr) =>
      arr.filter((x) => x.id !== l.id)
    );

    setPool((arr) => [...arr, l]);
  };

  const reset = () => {
    setPool(shuffleLetters(cur));
    setPicked([]);
  };

  const check = () => {
    if (
      guess.toUpperCase() ===
      target.toUpperCase()
    ) {
      speak(`Correct! ${cur.word}. Good job!`);

      fireConfetti();

      setScore((s) => s + 1);

      setTimeout(() => {
        if (idx + 1 < round.length) {
          setIdx(idx + 1);
        } else {
          setDone(true);

          const finalScore = score + 1;

          const stars =
            finalScore >= round.length - 1
              ? 3
              : finalScore >= round.length / 2
              ? 2
              : 1;

          recordLevel("spell", stars);
        }
      }, 1200);
    } else {
      speak("Oops, try again!");
    }
  };

  if (done) {
    return (
      <Layout
        title="Spell Game 🔤"
        testId="spell-done"
      >
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🌟</div>

          <h2 className="text-3xl font-extrabold text-amber-600">
            Super speller!
          </h2>

          <p className="text-slate-600 mt-2 text-lg">
            Score: {score} / {round.length}
          </p>

          <a
            href="/levels"
            className="toy-btn inline-block bg-amber-400 text-white px-6 py-3 mt-4"
          >
            Back to Map
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Spell Game 🔤"
      testId="spell-game"
    >
      <TeacherMascot message="Tap letters to spell the word." />

      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-slate-700">
            Spell this word:
          </p>

          <TTSButton
            text={`Spell ${cur.word}`}
            testId={`spell-tts-${idx}`}
            size="sm"
          />
        </div>

        <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
          <img
            src={cur.img}
            alt={cur.word}
            className="w-full h-40 sm:h-52 object-cover"
          />
        </div>

        <p className="text-center text-slate-500 mt-2 text-sm">
          Word has <b>{target.length}</b> letters
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 min-h-[64px]">
          {picked.length === 0 ? (
            <span className="text-slate-400">
              Tap letters below…
            </span>
          ) : (
            picked.map((l) => (
              <button
                key={l.id}
                onClick={() => undo(l)}
                className="bg-sky-100 border-2 border-sky-300 rounded-xl w-12 h-14 flex items-center justify-center text-2xl font-extrabold text-sky-700"
              >
                {l.ch}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 bg-amber-50 rounded-2xl p-3 border-2 border-amber-200">
          {pool.map((l) => (
            <button
              key={l.id}
              onClick={() => tap(l)}
              className="bg-white border-2 border-amber-200 rounded-xl w-12 h-14 flex items-center justify-center text-2xl font-extrabold text-amber-700"
            >
              {l.ch}
            </button