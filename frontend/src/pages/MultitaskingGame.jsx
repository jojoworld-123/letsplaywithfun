import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { MULTITASKING_PAIRS } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

export default function MultitaskingGame() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = MULTITASKING_PAIRS[idx];

  useEffect(() => {
    if (cur) speak(`Can we do these two together?`);
    // eslint-disable-next-line
  }, [idx]);

  const choose = (yes) => {
    if (picked !== null) return;
    setPicked(yes);
    if (yes === cur.ok) {
      speak(cur.say);
      fireConfetti();
      setScore((s) => s + 1);
    } else {
      speak(`Hmm. ${cur.say}`);
    }
    setTimeout(() => {
      if (idx + 1 < MULTITASKING_PAIRS.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (yes === cur.ok ? 1 : 0);
        const stars = finalScore >= MULTITASKING_PAIRS.length - 1 ? 3 : finalScore >= MULTITASKING_PAIRS.length / 2 ? 2 : 1;
        recordLevel("multitask", stars);
      }
    }, 1500);
  };

  if (done) {
    return (
      <Layout title="Multitasking 🎧" testId="multi-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🎶</div>
          <h2 className="text-3xl font-extrabold text-rose-600">Wonderful!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {MULTITASKING_PAIRS.length}</p>
          <a href="/levels" className="toy-btn inline-block bg-rose-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Multitasking 🎧" testId="multi-game">
      <TeacherMascot message="Multitasking means doing many works together. Can these two be done together?" />
      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-end mb-2">
          <TTSButton text={`Can we ${cur.a.label} and ${cur.b.label} together?`} testId={`multi-tts-${idx}`} size="sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[cur.a, cur.b].map((it, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 border-4 border-white shadow-inner">
              <img src={it.img} alt={it.label} className="w-full h-36 sm:h-44 object-contain p-3" />
              <div className="p-2 text-center font-extrabold text-slate-800">{it.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xl font-bold text-slate-700 mt-4">
          Can we do these two <span className="text-rose-500">at the same time?</span>
        </p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            disabled={picked !== null}
            onClick={() => choose(true)}
            data-testid="multi-yes"
            className={`toy-btn py-4 ${picked === true ? (cur.ok ? "bg-emerald-400 text-white" : "bg-rose-400 text-white anim-shake") : "bg-emerald-300 text-white"}`}
          >
            ✅ Yes
          </button>
          <button
            disabled={picked !== null}
            onClick={() => choose(false)}
            data-testid="multi-no"
            className={`toy-btn py-4 ${picked === false ? (!cur.ok ? "bg-emerald-400 text-white" : "bg-rose-400 text-white anim-shake") : "bg-rose-300 text-white"}`}
          >
            ❌ No
          </button>
        </div>
      </div>
    </Layout>
  );
}
