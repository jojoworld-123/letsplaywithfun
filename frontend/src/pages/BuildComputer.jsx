import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { IMG } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { CheckCircle2, RefreshCw } from "lucide-react";

const PARTS = [
  { id: "monitor", label: "Monitor", img: IMG.monitor, slot: "Monitor (top)" },
  { id: "cpu", label: "CPU", img: IMG.cpu, slot: "CPU (left)" },
  { id: "keyboard", label: "Keyboard", img: IMG.keyboard, slot: "Keyboard (front)" },
  { id: "mouse", label: "Mouse", img: IMG.mouse, slot: "Mouse (right)" },
];

const shuffle = (arr) => arr.slice().sort(() => 0.5 - Math.random());

export default function BuildComputer() {
  const [pool, setPool] = useState(() => shuffle(PARTS));
  const [placed, setPlaced] = useState({}); // {partId: true}
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  useEffect(() => {
    speak("Tap each part to put it on the desk and build a computer!");
    // eslint-disable-next-line
  }, []);

  const place = (part) => {
    if (placed[part.id]) return;
    setPlaced((p) => ({ ...p, [part.id]: true }));
    setPool((arr) => arr.filter((x) => x.id !== part.id));
    speak(`${part.label}. Placed on the desk!`);
    fireConfetti();
  };

  useEffect(() => {
    if (Object.keys(placed).length === PARTS.length && !done) {
      setDone(true);
      speak("Wonderful! You built a complete computer! Monitor, CPU, Keyboard and Mouse together!");
      recordLevel("build", 3);
    }
    // eslint-disable-next-line
  }, [placed]);

  const reset = () => {
    setPool(shuffle(PARTS));
    setPlaced({});
    setDone(false);
  };

  return (
    <Layout title="Build a Computer 🛠️" testId="build-game">
      <TeacherMascot message="Tap each part to add it to the desk. Build the full computer!" />

      <div className="flex justify-end mb-2">
        <TTSButton text="Tap each part to put it on the desk and build a computer!" testId="build-tts" size="sm" />
      </div>

      {/* Desk with slots */}
      <div className="toy-card p-4 sm:p-5 anim-pop bg-gradient-to-br from-amber-50 to-pink-50">
        <p className="text-center font-extrabold text-slate-700 mb-3">My Desk</p>

        <div className="grid grid-cols-3 gap-3 items-end">
          {/* CPU on left */}
          <BuildSlot part={PARTS[1]} placed={placed.cpu} />
          {/* Monitor on top center */}
          <BuildSlot part={PARTS[0]} placed={placed.monitor} large />
          {/* Mouse on right */}
          <BuildSlot part={PARTS[3]} placed={placed.mouse} />
        </div>

        {/* Keyboard at front */}
        <div className="mt-3">
          <BuildSlot part={PARTS[2]} placed={placed.keyboard} wide />
        </div>

        <div className="text-center text-sm text-slate-500 mt-3">
          {Object.keys(placed).length} / {PARTS.length} parts placed
        </div>
      </div>

      {/* Pool of remaining parts */}
      {!done && pool.length > 0 ? (
        <div className="mt-5 toy-card p-4">
          <p className="font-bold text-slate-700 mb-2 text-center">Tap a part to place it ✨</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pool.map((p) => (
              <button
                key={p.id}
                onClick={() => place(p)}
                data-testid={`build-part-${p.id}`}
                className="toy-card p-2 text-center hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img src={p.img} alt={p.label} className="w-full h-full object-cover" />
                </div>
                <div className="font-extrabold text-slate-800 mt-2">{p.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="mt-5 toy-card p-6 text-center bg-emerald-50 anim-pop">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-extrabold text-emerald-700">Computer built!</h2>
          <p className="text-slate-600">Monitor, CPU, Keyboard and Mouse - all together!</p>
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            <button onClick={reset} data-testid="build-replay" className="toy-btn bg-amber-400 text-white px-5 py-3 flex items-center gap-1">
              <RefreshCw size={16} /> Build Again
            </button>
            <a href="/levels" className="toy-btn inline-block bg-emerald-400 text-white px-5 py-3">Back to Map</a>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

function BuildSlot({ part, placed, large, wide }) {
  const h = wide ? "h-20 sm:h-24" : large ? "h-32 sm:h-40" : "h-20 sm:h-28";
  if (!placed) {
    return (
      <div className={`rounded-2xl border-4 border-dashed border-slate-300 ${h} flex items-center justify-center bg-white/60`}>
        <span className="text-slate-400 text-xs sm:text-sm font-bold text-center px-1">
          {part.slot}
        </span>
      </div>
    );
  }
  return (
    <div className={`rounded-2xl border-4 border-emerald-400 ${h} bg-white overflow-hidden anim-pop relative`}>
      <img src={part.img} alt={part.label} className="w-full h-full object-cover" />
      <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
        <CheckCircle2 size={16} />
      </span>
    </div>
  );
}
