import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { IMG } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";

const ITEMS = [
  { img: IMG.tree, label: "Tree", cat: "natural" },
  { img: IMG.mountain, label: "Mountain", cat: "natural" },
  { img: IMG.sun, label: "Sun", cat: "natural" },
  { img: IMG.river, label: "River", cat: "natural" },
  { img: IMG.car, label: "Car", cat: "manmade" },
  { img: IMG.house, label: "House", cat: "manmade" },
  { img: IMG.chair, label: "Chair", cat: "manmade" },
  { img: IMG.computer, label: "Computer", cat: "manmade" },
  { img: IMG.toy, label: "Toy", cat: "manmade" },
  { img: IMG.bicycle, label: "Bicycle", cat: "manmade" },
];

const shuffle = (arr) => arr.slice().sort(() => 0.5 - Math.random());

export default function SortIt() {
  const items = useMemo(() => shuffle(ITEMS).slice(0, 8), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = items[idx];

  useEffect(() => {
    if (cur && !done) speak(`Is this natural or man-made? ${cur.label}.`);
    // eslint-disable-next-line
  }, [idx, done]);

  const choose = (cat) => {
    if (picked !== null) return;
    setPicked(cat);
    if (cat === cur.cat) {
      setScore((s) => s + 1);
      fireConfetti();
      speak(`Correct! ${cur.label} is ${cat === "natural" ? "natural" : "man-made"}.`);
    } else {
      speak(`Oops! ${cur.label} is ${cur.cat === "natural" ? "natural" : "man-made"}.`);
    }
    setTimeout(() => {
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (cat === cur.cat ? 1 : 0);
        const stars = finalScore >= items.length - 1 ? 3 : finalScore >= items.length / 2 ? 2 : 1;
        recordLevel("sort", stars);
      }
    }, 1500);
  };

  if (done) {
    return (
      <Layout title="Sort It! 📦" testId="sort-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">📦</div>
          <h2 className="text-3xl font-extrabold text-lime-600">Great sorting!</h2>
          <p className="text-slate-600 mt-2 text-lg">Score: {score} / {items.length}</p>
          <a href="/levels" className="toy-btn inline-block bg-lime-500 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  const correctNat = picked !== null && cur.cat === "natural";
  const correctMan = picked !== null && cur.cat === "manmade";
  const wrongNat = picked === "natural" && cur.cat !== "natural";
  const wrongMan = picked === "manmade" && cur.cat !== "manmade";

  return (
    <Layout title="Sort It! 📦" testId="sort-game">
      <TeacherMascot message="Is this thing Natural 🌳 or Man-made 🏠? Tap the right bucket!" />

      <div className="flex items-center justify-between mb-2">
        <span className="bg-lime-100 border-2 border-lime-300 text-lime-700 font-extrabold rounded-full px-3 py-1 text-sm">
          Item {idx + 1} / {items.length}
        </span>
        <TTSButton text={`Is ${cur.label} natural or man-made?`} testId={`sort-tts-${idx}`} size="sm" />
      </div>

      {/* Item */}
      <div className="toy-card p-4 anim-pop text-center">
        <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mx-auto" style={{ maxWidth: 360 }}>
          <img src={cur.img} alt={cur.label} className="w-full h-48 object-cover" />
        </div>
        <div className="font-extrabold text-2xl text-slate-800 mt-3">{cur.label}</div>
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          disabled={picked !== null}
          onClick={() => choose("natural")}
          data-testid="sort-natural"
          className={`relative rounded-3xl py-8 flex flex-col items-center justify-center gap-2 border-4 shadow-[0_8px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.18)] transition-all ${
            correctNat
              ? "bg-emerald-400 text-white border-emerald-200"
              : wrongNat
              ? "bg-rose-400 text-white border-rose-200 anim-shake"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          <span className="text-5xl">🌳</span>
          <span className="font-extrabold text-lg">Natural</span>
        </button>

        <button
          disabled={picked !== null}
          onClick={() => choose("manmade")}
          data-testid="sort-manmade"
          className={`relative rounded-3xl py-8 flex flex-col items-center justify-center gap-2 border-4 shadow-[0_8px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.18)] transition-all ${
            correctMan
              ? "bg-emerald-400 text-white border-emerald-200"
              : wrongMan
              ? "bg-rose-400 text-white border-rose-200 anim-shake"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          <span className="text-5xl">🏠</span>
          <span className="font-extrabold text-lg">Man-made</span>
        </button>
      </div>
    </Layout>
  );
}
