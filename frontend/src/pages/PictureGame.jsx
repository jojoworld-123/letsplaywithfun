import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { PICTURE_ITEMS } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);

export default function PictureGame() {
  const items = useMemo(() => shuffle(PICTURE_ITEMS).slice(0, 8), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = items[idx];

  useEffect(() => {
    if (cur) speak("Look at the picture and choose the right name.");
    // eslint-disable-next-line
  }, [idx]);

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === cur.answer) {
      speak(`Correct! Good job!`);
      fireConfetti();
      setScore((s) => s + 1);
    } else {
      speak(`Oops, try again next time. The answer is ${cur.options[cur.answer]}.`);
    }
    setTimeout(() => {
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const stars = score + (i === cur.answer ? 1 : 0) >= items.length - 1 ? 3 : score + (i === cur.answer ? 1 : 0) >= items.length / 2 ? 2 : 1;
        recordLevel("picture", stars);
      }
    }, 1400);
  };

  if (done) {
    return (
      <Layout title="Picture Game 🖼️" testId="picture-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-3xl font-extrabold text-emerald-600">Great work!</h2>
          <p className="text-slate-600 mt-2 text-lg">You got {score} of {items.length} correct.</p>
          <a href="/levels" className="toy-btn inline-block bg-sky-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Picture Game 🖼️" testId="picture-game">
      <TeacherMascot message={`Question ${idx + 1} of ${items.length}. Hint: ${cur.hint}`} />
      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-slate-700 text-lg">What is this?</p>
          <TTSButton text={`What is this? ${cur.hint}`} testId={`picture-tts-${idx}`} size="sm" />
        </div>
        <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
          <img src={cur.img} alt="item" className="w-full h-56 sm:h-72 object-cover" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {cur.options.map((opt, i) => {
            const isCorrect = picked !== null && i === cur.answer;
            const isWrong = picked === i && i !== cur.answer;
            return (
              <button
                key={opt}
                disabled={picked !== null}
                onClick={() => choose(i)}
                data-testid={`picture-option-${i}`}
                className={`toy-btn py-4 ${isCorrect ? "bg-emerald-400 text-white" : isWrong ? "bg-rose-400 text-white anim-shake" : "bg-white text-slate-800 border-slate-200"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
