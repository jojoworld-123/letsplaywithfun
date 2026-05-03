import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { IMG } from "../data/content";
import { useTTS } from "../hooks/useTTS";
import { useGame } from "../store/gameStore";
import { fireConfetti } from "../components/Confetti";
import { ChevronRight, RotateCcw, BookOpen, Star } from "lucide-react";

// 5 EXACT user questions + 6 NEW user questions (natural, man-made, machine, manual machines, types of computers, places computers used)
const QA = [
  {
    q: "What is a computer?",
    a: "A computer is an electronic machine.",
    img: IMG.computer,
    options: ["An electronic machine", "A toy car", "A fruit"],
    answer: 0,
  },
  {
    q: "Why is accuracy important in a computer?",
    a: "Accuracy is important because a computer gives correct answers only when we give correct input.",
    img: IMG.cpu,
    options: [
      "Because it gives correct answers only when we give correct input",
      "Because it is colourful",
      "Because it is heavy",
    ],
    answer: 0,
  },
  {
    q: "Name two things a computer can do.",
    a: "A computer can write and draw.",
    img: IMG.draw,
    options: ["Write and draw", "Eat and sleep", "Run and jump"],
    answer: 0,
  },
  {
    q: "Give an example of multitasking on a computer.",
    a: "Listening to music while typing on a computer is multitasking.",
    img: IMG.music,
    options: [
      "Listening to music while typing on a computer",
      "Switching off the computer",
      "Cleaning the screen",
    ],
    answer: 0,
  },
  {
    q: "Name any two features of a computer.",
    a: "Speed and accuracy.",
    img: IMG.speed,
    options: ["Speed and accuracy", "Heavy and noisy", "Soft and small"],
    answer: 0,
  },
  // ----- 6 newly added Q&A -----
  {
    q: "What is a natural thing?",
    a: "Things made by nature are called natural things.",
    img: IMG.tree,
    options: [
      "Things made by nature are called natural things",
      "Things made in a factory",
      "Things made by computers",
    ],
    answer: 0,
  },
  {
    q: "What is a man-made thing?",
    a: "Things made by humans are called man-made things.",
    img: IMG.car,
    options: [
      "Things made by humans are called man-made things",
      "Things found in the river",
      "Things grown on a tree",
    ],
    answer: 0,
  },
  {
    q: "What is a machine?",
    a: "A thing that helps us do work easily and faster is called a machine.",
    img: IMG.washingMachine,
    options: [
      "A thing that helps us do work easily and faster",
      "A type of fruit",
      "A type of song",
    ],
    answer: 0,
  },
  {
    q: "Name two manual machines.",
    a: "Scissors and bicycle are manual machines.",
    img: IMG.scissors,
    options: [
      "Scissors and bicycle",
      "Refrigerator and fan",
      "Television and radio",
    ],
    answer: 0,
  },
  {
    q: "Name the types of computers.",
    a: "Desktop computer, laptop, smartphone and tablet.",
    img: IMG.laptop,
    options: [
      "Desktop, laptop, smartphone and tablet",
      "Tree, river, mountain and sun",
      "Mixer, fan, fridge and cooler",
    ],
    answer: 0,
  },
  {
    q: "Name places where computers are used.",
    a: "Computers are used at home, school, bank, hospital, shops, office and railway station.",
    img: IMG.house,
    options: [
      "Home, school, bank, hospital and shops",
      "Only on trees",
      "Only inside the river",
    ],
    answer: 0,
  },
];

export default function QAGame() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("learn"); // 'learn' (flashcard) or 'test' (mcq)
  const [flipped, setFlipped] = useState(false);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useTTS();
  const { recordLevel } = useGame();

  const cur = QA[idx];

  useEffect(() => {
    setFlipped(false);
    setPicked(null);
    if (cur) {
      if (phase === "learn") speak(`Question ${idx + 1}. ${cur.q}`);
      else speak(`Answer the question. ${cur.q}`);
    }
    // eslint-disable-next-line
  }, [idx, phase]);

  const flip = () => {
    setFlipped(true);
    speak(`Answer. ${cur.a}`);
  };

  const goNext = () => {
    if (idx + 1 < QA.length) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
      setPhase("test");
      speak("Now let's test what you learned!");
    }
  };

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === cur.answer) {
      setScore((s) => s + 1);
      fireConfetti();
      speak("Good job!");
    } else {
      speak(`Try again. The correct answer is: ${cur.options[cur.answer]}.`);
    }
    setTimeout(() => {
      if (idx + 1 < QA.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setDone(true);
        const finalScore = score + (i === cur.answer ? 1 : 0);
        const stars = finalScore >= QA.length - 1 ? 3 : finalScore >= QA.length / 2 ? 2 : 1;
        recordLevel("qa", stars);
      }
    }, 1500);
  };

  if (done) {
    return (
      <Layout title="Q&A Master 📝" testId="qa-done">
        <div className="toy-card p-8 text-center anim-pop">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="text-3xl font-extrabold text-indigo-600">Brilliant!</h2>
          <p className="text-slate-600 mt-2 text-lg">You answered {score} of {QA.length} correctly.</p>
          <a href="/levels" className="toy-btn inline-block bg-indigo-400 text-white px-6 py-3 mt-4">Back to Map</a>
        </div>
      </Layout>
    );
  }

  // Learn / Flashcard phase
  if (phase === "learn") {
    return (
      <Layout title="Q&A Master 📝" testId="qa-learn">
        <TeacherMascot
          message={`Step 1 of 2: Read & listen to ${QA.length} questions. Tap the card to see the answer.`}
        />

        <div className="flex items-center justify-between mb-2">
          <span className="bg-indigo-100 border-2 border-indigo-300 text-indigo-700 font-extrabold rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <BookOpen size={16} /> Learn · Q{idx + 1} / {QA.length}
          </span>
          <span className="bg-amber-100 border-2 border-amber-300 text-amber-700 font-extrabold rounded-full px-3 py-1 text-sm">
            Tap card to flip
          </span>
        </div>

        <button
          onClick={flipped ? () => setFlipped(false) : flip}
          data-testid="qa-flashcard"
          className={`toy-card p-5 w-full text-left ${flipped ? "bg-emerald-50" : ""} hover:-translate-y-0.5 transition-transform`}
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {flipped ? "✅ Answer" : "❓ Question"}
            </h2>
            <span onClick={(e) => e.stopPropagation()}>
              <TTSButton
                text={flipped ? cur.a : cur.q}
                testId={`qa-tts-${idx}`}
                size="sm"
              />
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
            <img src={cur.img} alt="qa" className="w-full h-44 sm:h-52 object-cover" />
          </div>

          <p className={`mt-4 text-lg sm:text-xl font-bold ${flipped ? "text-emerald-700" : "text-slate-800"}`}>
            {flipped ? cur.a : cur.q}
          </p>

          {!flipped ? (
            <p className="text-sm text-slate-500 mt-2">👆 Tap card to see the answer</p>
          ) : null}
        </button>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-slate-500 text-sm">Q{idx + 1} of {QA.length}</span>
          <button
            onClick={goNext}
            disabled={!flipped}
            data-testid="qa-next"
            className="toy-btn bg-indigo-400 text-white px-5 py-3 disabled:opacity-50 flex items-center gap-1"
          >
            {idx + 1 === QA.length ? <>Start Test <ChevronRight /></> : <>Next Question <ChevronRight /></>}
          </button>
        </div>
      </Layout>
    );
  }

  // Test phase - MCQ
  return (
    <Layout title="Q&A Master 📝" testId="qa-test">
      <TeacherMascot message={`Step 2 of 2: Pick the right answer. Q${idx + 1} of ${QA.length}.`} />
      <div className="flex items-center justify-between mb-2">
        <span className="bg-rose-100 border-2 border-rose-300 text-rose-700 font-extrabold rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <Star size={16} /> Test · Q{idx + 1} / {QA.length}
        </span>
        <button onClick={() => { setPhase("learn"); setIdx(0); }} data-testid="qa-review" className="text-sm text-indigo-600 font-bold flex items-center gap-1">
          <RotateCcw size={14} /> Review
        </button>
      </div>

      <div className="toy-card p-5 anim-pop">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">{cur.q}</h2>
          <TTSButton text={cur.q} testId={`qa-test-tts-${idx}`} size="sm" />
        </div>
        <div className="rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-inner mt-3">
          <img src={cur.img} alt="qa" className="w-full h-44 sm:h-56 object-cover" />
        </div>
        <div className="grid grid-cols-1 gap-3 mt-5">
          {cur.options.map((opt, i) => {
            const isCorrect = picked !== null && i === cur.answer;
            const isWrong = picked === i && i !== cur.answer;
            return (
              <button
                key={opt + i}
                disabled={picked !== null}
                onClick={() => choose(i)}
                data-testid={`qa-option-${i}`}
                className={`toy-btn text-left px-5 py-4 ${isCorrect ? "bg-emerald-400 text-white" : isWrong ? "bg-rose-400 text-white anim-shake" : "bg-white text-slate-800 border-slate-200"}`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
