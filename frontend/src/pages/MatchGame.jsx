import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import { MATCH_PAIRS } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { CheckCircle2 } from "lucide-react";

const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);

export default function MatchGame() {
  const round = useMemo(() => shuffle(MATCH_PAIRS).slice(0, 6), []);
  const [words] = useState(() => shuffle(round.map((r) => r.word)));
  const [pics] = useState(() => round);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState({}); // word -> true
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  useEffect(() => {
    speak("Match each picture with the correct word.");
    // eslint-disable-next-line
  }, []);

  const allDone = Object.keys(matched).length === round.length;

  useEffect(() => {
    if (allDone) {
      fireConfetti();
      speak("Wow! All matched. Excellent!");
      recordLevel("match", 3);
    }
    // eslint-disable-next-line
  }, [allDone]);

  const onWordTap = (w) => {
    if (matched[w]) return;
    setSelectedWord(w);
    speak(w);
  };

  const onPicTap = (p) => {
    if (matched[p.word]) return;
    if (!selectedWord) {
      speak(`First tap a word, then tap the matching picture.`);
      return;
    }
    if (selectedWord === p.word) {
      setMatched({ ...matched, [p.word]: true });
      setSelectedWord(null);
      speak(`Correct! ${p.word}.`);
      fireConfetti();
    } else {
      speak("Try again!");
      setSelectedWord(null);
    }
  };

  return (
    <Layout title="Match Game 🧩" testId="match-game">
      <TeacherMascot message="Tap a word, then tap the matching picture." />

      <div className="grid grid-cols-2 gap-4 mt-3">
        {/* Words Column */}
        <div className="toy-card p-3 sm:p-4">
          <h3 className="font-extrabold text-slate-700 mb-2 text-center">Words</h3>
          <div className="flex flex-col gap-2">
            {words.map((w) => (
              <button
                key={w}
                disabled={matched[w]}
                onClick={() => onWordTap(w)}
                data-testid={`match-word-${w}`}
                className={`toy-btn py-3 text-base ${matched[w] ? "bg-emerald-300 text-white opacity-70" : selectedWord === w ? "bg-amber-300 text-slate-900 ring-4 ring-amber-200" : "bg-white text-slate-800 border-slate-200"}`}
              >
                {matched[w] ? <CheckCircle2 className="inline mr-1" size={18} /> : null}
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Pictures Column */}
        <div className="toy-card p-3 sm:p-4">
          <h3 className="font-extrabold text-slate-700 mb-2 text-center">Pictures</h3>
          <div className="grid grid-cols-1 gap-2">
            {pics.map((p) => (
              <button
                key={p.word}
                disabled={matched[p.word]}
                onClick={() => onPicTap(p)}
                data-testid={`match-pic-${p.word}`}
                className={`rounded-xl overflow-hidden border-4 ${matched[p.word] ? "border-emerald-400 opacity-60" : "border-white"} shadow hover:-translate-y-0.5 transition-transform`}
              >
                <img src={p.img} alt={p.word} className="w-full h-20 sm:h-24 object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {allDone ? (
        <div className="mt-5 toy-card p-5 text-center bg-emerald-50">
          <h2 className="text-2xl font-extrabold text-emerald-700">All matched! 🎉</h2>
          <a href="/levels" className="toy-btn inline-block bg-emerald-400 text-white px-6 py-3 mt-3">Back to Map</a>
        </div>
      ) : null}
    </Layout>
  );
}
