import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const TF_CLASS_1 = [
  { s: "Computers help us draw.", ok: true },
  { s: "The river is man-made.", ok: false, why: "A river is a natural thing." },
  { s: "Cars are machines.", ok: true },
  { s: "Trees are man-made.", ok: false, why: "Trees are natural things." },
  { s: "A smartphone is a type of computer.", ok: true },
  { s: "Computers never make mistakes when used properly.", ok: true, why: "If we give correct input, computers give correct answers." },
  { s: "We can play games on a computer.", ok: true },
  { s: "Computers cannot help us connect with friends.", ok: false, why: "Computers help us connect with friends through the internet." },
  { s: "A computer can cook food.", ok: false, why: "A computer cannot cook food." },
];

const TF_CLASS_2 = [
  { s: "Computers are only used by teachers.", ok: false, why: "Computers are used by everyone." },
  { s: "Computers help us find places on maps.", ok: true },
  { s: "Shops use computers to count items.", ok: true },
  { s: "Computers are smarter than humans.", ok: false, why: "Humans made computers, so humans are smarter." },
  { s: "We cannot draw pictures on computers.", ok: false, why: "We can draw pictures on computers." },
  { s: "A web camera is used for video chatting.", ok: true },
  { s: "A joystick is used for typing.", ok: false, why: "A joystick is used for playing games. A keyboard is used for typing." },
  { s: "A microphone helps us to give sound to the computer.", ok: true },
  { s: "Optical disks are used to store data.", ok: true },
  { s: "CPU is used to show output.", ok: false, why: "CPU is the brain of the computer. The monitor is used to show output." },
];

export default function TrueFalseGame() {
  const [classKey, setClassKey] = useState("1");
  const items = classKey === "1" ? TF_CLASS_1 : TF_CLASS_2;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = items[idx];

  useEffect(() => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }, [classKey]);

  useEffect(() => {
    if (cur && !done) speak(cur.s);
    // eslint-disable-next-line
  }, [idx, classKey, done]);

  const choose = (yes) => {
    if (picked !== null) return;
    setPicked(yes);
    if (yes === cur.ok) {
      setScore((s) => s + 1);
      fireConfetti();
      speak("Good job!");
    } else {
      speak(`Oops! ${cur.why || (cur.ok ? "That is true." : "That is false.")}`);
    }
    setTimeout(() => {
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (yes === cur.ok ? 1 : 0);
        const stars = finalScore >= items.length - 1 ? 3 : finalScore >= items.length / 2 ? 2 : 1;
        recordLevel("truefalse", stars);
      }
    }, 1700);
  };

  const replayClass = () => {
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  if (done) {
    return (
      <Layout title="True or False 👍👎" testId="tf-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-3xl font-extrabold text-emerald-600">Awesome!</h2>
          <p className="text-slate-600 mt-2 text-lg">Class {classKey} score: {score} / {items.length}</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={replayClass} data-testid="tf-replay" className="toy-btn bg-emerald-400 text-white px-5 py-3">Play Again</button>
            <a href="/levels" className="toy-btn inline-block bg-white text-slate-700 border-slate-200 px-5 py-3">Back to Map</a>
          </div>
        </div>
      </Layout>
    );
  }

  const pickedYes = picked === true;
  const pickedNo = picked === false;
  const correctYes = picked !== null && cur.ok;
  const correctNo = picked !== null && !cur.ok;

  return (
    <Layout title="True or False 👍👎" testId="tf-game">
      <TeacherMascot
        message="Tap 👍 if the sentence is TRUE. Tap 👎 if it is FALSE."
      />

      {/* Class selector */}
      <div className="flex gap-2 justify-center mb-3">
        {["1", "2"].map((c) => (
          <button
            key={c}
            data-testid={`tf-class-${c}`}
            onClick={() => setClassKey(c)}
            className={`toy-btn px-5 py-2 text-base ${classKey === c ? "bg-emerald-400 text-white" : "bg-white text-emerald-600 border-emerald-200"}`}
          >
            Class {c}
          </button>
        ))}
      </div>

      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-emerald-100 border-2 border-emerald-300 text-emerald-700 font-extrabold rounded-full px-3 py-1 text-sm">
            Q{idx + 1} / {items.length}
          </span>
          <TTSButton text={cur.s} testId={`tf-tts-${idx}`} size="sm" />
        </div>

        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 my-6 text-center leading-snug">
          {cur.s}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Thumbs Up = TRUE */}
          <button
            disabled={picked !== null}
            onClick={() => choose(true)}
            data-testid="tf-true"
            className={`relative rounded-3xl py-8 sm:py-10 flex flex-col items-center justify-center gap-2 border-4 shadow-[0_8px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.18)] transition-all ${
              correctYes
                ? "bg-emerald-400 text-white border-emerald-200"
                : pickedYes && !correctYes
                ? "bg-rose-400 text-white border-rose-200 anim-shake"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <ThumbsUp size={56} fill={correctYes || pickedYes ? "currentColor" : "transparent"} />
            <span className="font-extrabold text-2xl">TRUE</span>
          </button>

          {/* Thumbs Down = FALSE */}
          <button
            disabled={picked !== null}
            onClick={() => choose(false)}
            data-testid="tf-false"
            className={`relative rounded-3xl py-8 sm:py-10 flex flex-col items-center justify-center gap-2 border-4 shadow-[0_8px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.18)] transition-all ${
              correctNo
                ? "bg-rose-400 text-white border-rose-200"
                : pickedNo && !correctNo
                ? "bg-rose-400 text-white border-rose-200 anim-shake"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
            }`}
          >
            <ThumbsDown size={56} fill={correctNo || pickedNo ? "currentColor" : "transparent"} />
            <span className="font-extrabold text-2xl">FALSE</span>
          </button>
        </div>

        {picked !== null && cur.why ? (
          <p data-testid="tf-explain" className="mt-4 text-center text-slate-600 italic">
            💡 {cur.why}
          </p>
        ) : null}

        <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${((idx + 1) / items.length) * 100}%` }} />
        </div>
      </div>
    </Layout>
  );
}
