import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../store/gameStore";
import { useTTS } from "../hooks/useTTS";
import TeacherMascot from "../components/TeacherMascot";
import TTSButton from "../components/TTSButton";
import { Sparkles, Rocket } from "lucide-react";
import { TEACHER } from "../data/content";

export default function WelcomeScreen() {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { registerStudent } = useGame();
  const { speak } = useTTS();

  const greeting = `Hello students! My name is Jyoti Singh, your teacher. Welcome to Computer Champ. Tell me your name and your class, and let us start learning together.`;

  const start = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await registerStudent(name.trim(), studentClass);
    speak(`Hello ${name}! Let us start learning.`);
    setTimeout(() => navigate("/levels"), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full toy-card p-6 sm:p-8 anim-pop">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-pink-100 text-pink-600 font-bold rounded-full px-4 py-1 text-sm border-2 border-pink-200 flex items-center gap-1">
            <Sparkles size={16} /> Class 1 & 2 Fun Game
          </div>
        </div>
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-sky-700">
          Computer Champ
        </h1>
        <p className="text-center text-slate-600 text-lg mt-1">Learn computer in a fun way! 🌈</p>

        <div className="flex justify-center my-4">
          <div className="relative">
            <img
              src={TEACHER.photo}
              alt={TEACHER.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-300 shadow-xl"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-400 text-white font-bold px-3 py-0.5 rounded-full border-2 border-white text-sm">
              {TEACHER.fullName}
            </span>
          </div>
        </div>

        <TeacherMascot message={greeting} />
        <div className="flex justify-end -mt-3 mb-2">
          <TTSButton text={greeting} testId="welcome-tts" size="sm" />
        </div>

        <form onSubmit={start} className="space-y-4 mt-4">
          <div>
            <label className="font-bold text-slate-700 text-lg mb-1 block">Your Name</label>
            <input
              data-testid="welcome-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name..."
              className="pill-input"
              maxLength={20}
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 text-lg mb-1 block">Your Class</label>
            <div className="grid grid-cols-2 gap-3">
              {["1", "2"].map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`welcome-class-${c}`}
                  onClick={() => setStudentClass(c)}
                  className={`toy-btn py-4 text-2xl ${studentClass === c ? "bg-sky-400 text-white" : "bg-white text-sky-600 border-sky-200"}`}
                >
                  Class {c}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            data-testid="welcome-start-btn"
            disabled={!name.trim() || submitting}
            className="toy-btn w-full py-5 bg-gradient-to-r from-pink-400 to-amber-400 text-white text-2xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Rocket size={24} /> Let's Start!
          </button>
        </form>
      </div>
    </div>
  );
}
