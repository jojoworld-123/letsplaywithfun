import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { LEARN_TOPICS } from "../data/content";
import { useGame } from "../store/gameStore";
import { useTTS } from "../hooks/useTTS";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LearnMode() {
  const [idx, setIdx] = useState(0);
  const topic = LEARN_TOPICS[idx];
  const { recordLevel } = useGame();
  const { speak } = useTTS();
const [voiceLang, setVoiceLang] = useState("en");

  useEffect(() => {
  // auto voice disable
}, [idx]);
  const next = () => {
    if (idx < LEARN_TOPICS.length - 1) setIdx(idx + 1);
    else recordLevel("learn", 3);
  };

  return (
    <Layout title="Learn Mode 📘" testId="learn-mode">
      <TeacherMascot message={`Topic ${idx + 1} of ${LEARN_TOPICS.length}: ${topic.title}`} />

      <div className="toy-card p-5 sm:p-6 anim-pop">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-700">{topic.title}</h2>
         <div className="flex items-center gap-2">
  <button
    onClick={() => setVoiceLang(voiceLang === "en" ? "hi" : "en")}
    className="px-3 py-2 bg-white border rounded"
  >
    🌐 {voiceLang === "en" ? "English" : "Hindi"}
  </button>

  <TTSButton
    text={topic.speak || topic.text}
    testId={`learn-tts-${topic.id}`}
    lang={voiceLang}
  />
</div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 via-amber-50 to-pink-100 border-4 border-white shadow-inner">
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-56 sm:h-72 object-cover"
            data-testid={`learn-image-${topic.id}`}
          />
        </div>

        <p className="text-lg sm:text-xl text-slate-700 mt-4 font-medium">{topic.text}</p>

        {topic.bullets ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            {topic.bullets.map((b) => (
              <button
                key={b.word}
                onClick={() => speak(`${b.word}. ${b.desc}`, voiceLang)}
                data-testid={`learn-bullet-${b.word}`}
                className="bg-white rounded-2xl p-3 border-2 border-slate-100 shadow hover:-translate-y-0.5 transition-transform text-left"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                  <img src={b.img} alt={b.word} className="w-full h-full object-cover" />
                </div>
                <div className="font-extrabold text-slate-800 mt-2">{b.word}</div>
                {b.desc ? <div className="text-xs text-slate-500">{b.desc}</div> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          data-testid="learn-prev"
          className="toy-btn bg-white text-slate-700 px-5 py-3 border-slate-200 disabled:opacity-40 flex items-center gap-1"
        >
          <ChevronLeft /> Back
        </button>
        <div className="flex-1 mx-2 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-400 transition-all"
            style={{ width: `${((idx + 1) / LEARN_TOPICS.length) * 100}%` }}
          />
        </div>
        <button
          onClick={next}
          data-testid="learn-next"
          className="toy-btn bg-sky-400 text-white px-5 py-3 flex items-center gap-1"
        >
          {idx === LEARN_TOPICS.length - 1 ? (<><CheckCircle2 /> Done</>) : (<>Next <ChevronRight /></>)}
        </button>
      </div>
    </Layout>
  );
}
