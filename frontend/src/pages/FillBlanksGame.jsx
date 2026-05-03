import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

// Class 1 — 10 fill-in-the-blanks
const FB_CLASS_1 = [
  { before: "A computer works very", after: ".", answer: "fast", options: ["fast", "slow", "sad"] },
  { before: "Computers can save our work using their", after: ".", answer: "storage", options: ["storage", "music", "water"] },
  { before: "The ability to do many tasks at once is called", after: ".", answer: "multitasking", options: ["multitasking", "sleeping", "eating"] },
  { before: "A computer helps us find", after: " and learn information.", answer: "new things", options: ["new things", "food", "animals"] },
  { before: "Computers help us", after: " with people far away.", answer: "connect", options: ["connect", "fight", "hide"] },
  { before: "A", after: " is made by humans.", answer: "toy", options: ["toy", "tree", "river"] },
  { before: "A", after: " helps us do work easily.", answer: "machine", options: ["machine", "banana", "song"] },
  { before: "A bicycle is a", after: " machine.", answer: "manual", options: ["manual", "eating", "flying"] },
  { before: "A", after: " is a type of computer.", answer: "laptop", options: ["laptop", "banana", "ball"] },
  { before: "A", after: " stays on a table and has a big screen.", answer: "desktop", options: ["desktop", "fan", "sun"] },
];

// Class 2 — 10 fill-in-the-blanks
const FB_CLASS_2 = [
  { before: "A", after: " helps us to draw and click on the computer.", answer: "mouse", options: ["mouse", "ball", "fan"] },
  { before: "A", after: " is used to input photos and documents.", answer: "scanner", options: ["scanner", "mixer", "speaker"] },
  { before: "A", after: " is a small device that stores data and can be carried.", answer: "pen drive", options: ["pen drive", "table", "fan"] },
  { before: "The output from a printer is called a", after: ".", answer: "printout", options: ["printout", "song", "drawing"] },
  { before: "A", after: " is smaller than a pen drive.", answer: "memory card", options: ["memory card", "monitor", "keyboard"] },
  { before: "Computers in", after: " help to control machines.", answer: "factories", options: ["factories", "kitchens", "gardens"] },
  { before: "We use computers to watch", after: " at home.", answer: "cartoons", options: ["cartoons", "soup", "clouds"] },
  { before: "A", after: " is a small computer.", answer: "smartphone", options: ["smartphone", "broom", "fork"] },
  { before: "Computers help to book", after: " tickets.", answer: "flight", options: ["flight", "banana", "fish"] },
  { before: "In", after: " computers are used to keep record of our money.", answer: "bank", options: ["bank", "river", "school"] },
];

export default function FillBlanksGame() {
  const [classKey, setClassKey] = useState("1");
  const items = classKey === "1" ? FB_CLASS_1 : FB_CLASS_2;
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
    if (cur && !done) speak(`${cur.before} blank ${cur.after}`);
    // eslint-disable-next-line
  }, [idx, classKey, done]);

  const sayFull = (word) => speak(`${cur.before} ${word} ${cur.after}`);

  const choose = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === cur.answer) {
      setScore((s) => s + 1);
      fireConfetti();
      sayFull(opt);
    } else {
      speak(`Try again. The correct word is ${cur.answer}.`);
    }
    setTimeout(() => {
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (opt === cur.answer ? 1 : 0);
        const stars = finalScore >= items.length - 1 ? 3 : finalScore >= items.length / 2 ? 2 : 1;
        recordLevel("fill", stars);
      }
    }, 1700);
  };

  const replay = () => {
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  if (done) {
    return (
      <Layout title="Fill in the Blanks ✏️" testId="fb-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">✨</div>
          <h2 className="text-3xl font-extrabold text-teal-600">Wonderful!</h2>
          <p className="text-slate-600 mt-2 text-lg">Class {classKey} score: {score} / {items.length}</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={replay} data-testid="fb-replay" className="toy-btn bg-teal-400 text-white px-5 py-3">Play Again</button>
            <a href="/levels" className="toy-btn inline-block bg-white text-slate-700 border-slate-200 px-5 py-3">Back to Map</a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Fill in the Blanks ✏️" testId="fb-game">
      <TeacherMascot message="Read the sentence and pick the right word for the blank!" />

      {/* Class selector */}
      <div className="flex gap-2 justify-center mb-3">
        {["1", "2"].map((c) => (
          <button
            key={c}
            data-testid={`fb-class-${c}`}
            onClick={() => setClassKey(c)}
            className={`toy-btn px-5 py-2 text-base ${classKey === c ? "bg-teal-400 text-white" : "bg-white text-teal-600 border-teal-200"}`}
          >
            Class {c}
          </button>
        ))}
      </div>

      <div className="toy-card p-5 anim-pop">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-teal-100 border-2 border-teal-300 text-teal-700 font-extrabold rounded-full px-3 py-1 text-sm">
            Q{idx + 1} / {items.length}
          </span>
          <TTSButton text={`${cur.before} blank ${cur.after}`} testId={`fb-tts-${idx}`} size="sm" />
        </div>

        {/* Sentence with blank */}
        <p className="text-xl sm:text-2xl font-bold text-slate-800 my-6 leading-relaxed">
          {cur.before}{" "}
          <span
            data-testid="fb-blank-slot"
            className={`inline-block min-w-[110px] text-center px-3 py-1 rounded-xl border-b-4 ${
              picked === cur.answer
                ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                : picked !== null && picked !== cur.answer
                ? "bg-rose-100 border-rose-400 text-rose-700 anim-shake"
                : "bg-amber-50 border-amber-300 text-amber-700"
            }`}
          >
            {picked || "______"}
          </span>{" "}
          {cur.after}
        </p>

        {/* Word options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {cur.options.map((opt) => {
            const isCorrect = picked !== null && opt === cur.answer;
            const isWrong = picked === opt && opt !== cur.answer;
            return (
              <button
                key={opt}
                disabled={picked !== null}
                onClick={() => choose(opt)}
                data-testid={`fb-option-${opt}`}
                className={`toy-btn py-4 text-lg ${
                  isCorrect
                    ? "bg-emerald-400 text-white"
                    : isWrong
                    ? "bg-rose-400 text-white anim-shake"
                    : "bg-white text-slate-800 border-slate-200"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-400 transition-all"
            style={{ width: `${((idx + 1) / items.length) * 100}%` }}
          />
        </div>
      </div>
    </Layout>
  );
}
