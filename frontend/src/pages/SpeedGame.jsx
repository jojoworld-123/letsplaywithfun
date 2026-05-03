import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import { QUIZ_QUESTIONS } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { Timer, Zap } from "lucide-react";

const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);

export default function SpeedGame() {
  const round = useMemo(() => shuffle(QUIZ_QUESTIONS).slice(0, 10), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();
  const timerRef = useRef(null);

  useEffect(() => {
    speak("Speed game! Answer fast. You have 45 seconds.");
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finish(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, []);

  const finish = (extra) => {
    setDone(true);
    const finalScore = score + extra;
    const stars = finalScore >= 8 ? 3 : finalScore >= 5 ? 2 : 1;
    recordLevel("speed", stars);
  };

  const cur = round[idx];

  const choose = (i) => {
    if (done) return;
    if (cur && i === cur.answer) {
      setScore((s) => s + 1);
      fireConfetti();
    }
    if (idx + 1 < round.length) setIdx(idx + 1);
    else {
      clearInterval(timerRef.current);
      finish(i === cur.answer ? 1 : 0);
    }
  };

  if (done) {
    return (
      <Layout title="Speed Game ⚡" testId="speed-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">⚡</div>
          <h2 className="text-3xl font-extrabold text-orange-600">Lightning fast!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {round.length}</p>
          <a href="/levels" className="toy-btn inline-block bg-orange-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Speed Game ⚡" testId="speed-game">
      <TeacherMascot message="Quick! Tap the right answer fast." />
      <div className="flex items-center justify-between gap-3 mb-2">
        <span data-testid="speed-timer" className="bg-orange-100 border-2 border-orange-300 text-orange-700 font-extrabold rounded-full px-4 py-2 flex items-center gap-1">
          <Timer size={18} /> {time}s
        </span>
        <span className="bg-amber-100 border-2 border-amber-300 text-amber-700 font-extrabold rounded-full px-4 py-2 flex items-center gap-1">
          <Zap size={18} /> {score}
        </span>
      </div>
      <div className="toy-card p-5 anim-pop">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">{cur.q}</h2>
        {cur.img ? (
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-pink-100 border-4 border-white shadow-inner mt-3">
            <img src={cur.img} alt="quiz" className="w-full h-36 sm:h-44 object-contain p-3" />
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-3 mt-4">
          {cur.options.map((opt, i) => (
            <button
              key={opt + i}
              onClick={() => choose(i)}
              data-testid={`speed-option-${i}`}
              className="toy-btn text-left px-5 py-4 bg-white text-slate-800 border-slate-200"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
