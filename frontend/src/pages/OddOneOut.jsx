import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { IMG } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

// Each round has 4 items; one is the odd one out (different category).
const ROUNDS = [
  {
    hint: "Three are computers. One is not!",
    items: [
      { img: IMG.laptop, label: "Laptop", odd: false },
      { img: IMG.tablet, label: "Tablet", odd: false },
      { img: IMG.tree, label: "Tree", odd: true },
      { img: IMG.smartphone, label: "Smartphone", odd: false },
    ],
  },
  {
    hint: "Three are natural. One is man-made!",
    items: [
      { img: IMG.tree, label: "Tree", odd: false },
      { img: IMG.mountain, label: "Mountain", odd: false },
      { img: IMG.car, label: "Car", odd: true },
      { img: IMG.river, label: "River", odd: false },
    ],
  },
  {
    hint: "Three are man-made. One is natural!",
    items: [
      { img: IMG.house, label: "House", odd: false },
      { img: IMG.chair, label: "Chair", odd: false },
      { img: IMG.sun, label: "Sun", odd: true },
      { img: IMG.car, label: "Car", odd: false },
    ],
  },
  {
    hint: "Three are input devices. One is output!",
    items: [
      { img: IMG.keyboard, label: "Keyboard", odd: false },
      { img: IMG.mouse, label: "Mouse", odd: false },
      { img: IMG.monitor, label: "Monitor", odd: true },
      { img: IMG.keyboard, label: "Keyboard", odd: false },
    ],
  },
  {
    hint: "Three are machines. One is not!",
    items: [
      { img: IMG.fan, label: "Fan", odd: false },
      { img: IMG.washingMachine, label: "Washing Machine", odd: false },
      { img: IMG.bicycle, label: "Bicycle", odd: false },
      { img: IMG.book, label: "Book", odd: true },
    ],
  },
  {
    hint: "Three you can do on a computer. One you cannot!",
    items: [
      { img: IMG.draw, label: "Draw", odd: false },
      { img: IMG.music, label: "Listen Music", odd: false },
      { img: IMG.game, label: "Play Game", odd: false },
      { img: IMG.tree, label: "Plant a Tree", odd: true },
    ],
  },
  {
    hint: "Three are kid-friendly. One is grown-up only!",
    items: [
      { img: IMG.toy, label: "Toy", odd: false },
      { img: IMG.book, label: "Book", odd: false },
      { img: IMG.refrigerator, label: "Refrigerator", odd: true },
      { img: IMG.game, label: "Game", odd: false },
    ],
  },
  {
    hint: "Three give output. One does not!",
    items: [
      { img: IMG.monitor, label: "Monitor", odd: false },
      { img: IMG.speaker, label: "Speaker", odd: false },
      { img: IMG.printer, label: "Printer", odd: false },
      { img: IMG.mouse, label: "Mouse", odd: true },
    ],
  },
];

const shuffleRound = (round) => {
  const items = round.items.map((it, i) => ({ ...it, _i: i })).sort(() => 0.5 - Math.random());
  return { ...round, items };
};

export default function OddOneOut() {
  const rounds = useMemo(() => ROUNDS.map(shuffleRound), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = rounds[idx];

  useEffect(() => {
    if (cur && !done) speak(`Find the odd one out. ${cur.hint}`);
    // eslint-disable-next-line
  }, [idx, done]);

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (cur.items[i].odd) {
      setScore((s) => s + 1);
      fireConfetti();
      speak(`Yes! ${cur.items[i].label} is the odd one!`);
    } else {
      const oddIdx = cur.items.findIndex((it) => it.odd);
      speak(`Try again. The odd one is ${cur.items[oddIdx].label}.`);
    }
    setTimeout(() => {
      if (idx + 1 < rounds.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (cur.items[i].odd ? 1 : 0);
        const stars = finalScore >= rounds.length - 1 ? 3 : finalScore >= rounds.length / 2 ? 2 : 1;
        recordLevel("oddone", stars);
      }
    }, 1700);
  };

  if (done) {
    return (
      <Layout title="Odd One Out 🔍" testId="odd-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🕵️</div>
          <h2 className="text-3xl font-extrabold text-cyan-600">Sharp eyes!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {rounds.length}</p>
          <a href="/levels" className="toy-btn inline-block bg-cyan-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Odd One Out 🔍" testId="odd-game">
      <TeacherMascot message={`Round ${idx + 1} of ${rounds.length}: ${cur.hint}`} />

      <div className="flex items-center justify-between mb-2">
        <span className="bg-cyan-100 border-2 border-cyan-300 text-cyan-700 font-extrabold rounded-full px-3 py-1 text-sm">
          Round {idx + 1} / {rounds.length}
        </span>
        <TTSButton text={`Find the odd one out. ${cur.hint}`} testId={`odd-tts-${idx}`} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cur.items.map((it, i) => {
          const isCorrect = picked !== null && it.odd;
          const isWrong = picked === i && !it.odd;
          return (
            <button
              key={`${it.label}-${i}`}
              disabled={picked !== null}
              onClick={() => choose(i)}
              data-testid={`odd-option-${i}`}
              className={`toy-card p-2 hover:-translate-y-0.5 transition-transform ${
                isCorrect ? "ring-4 ring-emerald-400" : isWrong ? "ring-4 ring-rose-400 anim-shake" : ""
              }`}
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img src={it.img} alt={it.label} className="w-full h-full object-cover" />
              </div>
              <div className="font-extrabold text-slate-800 mt-2 text-center">{it.label}</div>
            </button>
          );
        })}
      </div>
    </Layout>
  );
}
