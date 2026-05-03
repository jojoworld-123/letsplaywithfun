import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { QUIZ_QUESTIONS } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);

export default function QuizGame() {
  // Always include first 5 EXACT questions, then shuffle the remaining
  const items = useMemo(() => {
    const exact = QUIZ_QUESTIONS.slice(0, 5);
    const rest = shuffle(QUIZ_QUESTIONS.slice(5)).slice(0, 7);
    return [...exact, ...rest];
  }, []);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = items[idx];

  useEffect(() => {
    if (cur) speak(cur.speak || cur.q);
    // eslint-disable-next-line
  }, [idx]);

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === cur.answer) {
      speak("Good job!");
      fireConfetti();
      setScore((s) => s + 1);
    } else {
      speak(`Try again. The correct answer is: ${cur.options[cur.answer]}.`);
    }
    setTimeout(() => {
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (i === cur.answer ? 1 : 0);
        const stars = finalScore >= items.length - 1 ? 3 : finalScore >= items.length / 2 ? 2 : 1;
        recordLevel("quiz", stars);
      }
    }, 1500);
  };

  if (done) {
    return (
      <Layout title="Quiz Game ❓" testId="quiz-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🏅</div>
          <h2 className="text-3xl font-extrabold text-violet-600">Awesome!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {items.length}</p>
          <a href="/levels" className="toy-btn inline-block bg-violet-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quiz Game ❓" testId="quiz-game">
      <TeacherMascot message={`Question ${idx + 1} of ${items.length}.`} />
      <div className="toy-card p-5 anim-pop">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">{cur.q}</h2>
          <TTSButton text={cur.speak || cur.q} testId={`quiz-tts-${idx}`} size="sm" />
        </div>
        {cur.img ? (
          <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
            <img src={cur.img} alt="quiz" className="w-full h-44 sm:h-56 object-cover" />
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-3 mt-5">
          {cur.options.map((opt, i) => {
            const isCorrect = picked !== null && i === cur.answer;
            const isWrong = picked === i && i !== cur.answer;
            return (
              <button
                key={opt + i}
                disabled={picked !== null}
                onClick={() => choose(i)}
                data-testid={`quiz-option-${i}`}
                className={`toy-btn text-left px-5 py-4 ${isCorrect ? "bg-emerald-400 text-white" : isWrong ? "bg-rose-400 text-white anim-shake" : "bg-white text-slate-800 border-slate-200"}`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
        </div>
        <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-violet-400 transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
        </div>
      </div>
    </Layout>
  );
}
