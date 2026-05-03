import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../store/gameStore";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import StarRow from "../components/StarRow";
import { useTTS } from "../hooks/useTTS";
import {
  BookOpen,
  Image as ImageIcon,
  HelpCircle,
  Puzzle,
  Type,
  Headphones,
  Zap,
  Shuffle,
  Award,
  Lock,
} from "lucide-react";

const LEVELS = [
  { id: "learn", title: "Learn Mode", icon: BookOpen, color: "bg-sky-400", to: "/learn" },
  { id: "picture", title: "Picture Game", icon: ImageIcon, color: "bg-pink-400", to: "/picture" },
  { id: "quiz", title: "Quiz Game", icon: HelpCircle, color: "bg-violet-400", to: "/quiz" },
  { id: "match", title: "Match Game", icon: Puzzle, color: "bg-emerald-400", to: "/match" },
  { id: "spell", title: "Spell Game", icon: Type, color: "bg-amber-400", to: "/spell" },
  { id: "multitask", title: "Multitasking", icon: Headphones, color: "bg-rose-400", to: "/multitask" },
  { id: "speed", title: "Speed Game", icon: Zap, color: "bg-orange-400", to: "/speed" },
  { id: "jumble", title: "Jumble Master", icon: Shuffle, color: "bg-fuchsia-400", to: "/jumble" },
];

export default function LevelMap() {
  const { name, studentId, progress, badges, stars } = useGame();
  const navigate = useNavigate();
  const { speak } = useTTS();

  useEffect(() => {
    if (!studentId) navigate("/");
  }, [studentId, navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      speak(`Welcome ${name || "friend"}! Choose a game to play and earn stars.`);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, []);

  const allDone = LEVELS.every((l) => progress[l.id]?.completed);

  return (
    <Layout testId="level-map" showBack={false}>
      <TeacherMascot
        message={`Hi ${name || "friend"}! Pick any game island to play. Earn ${LEVELS.length * 3} stars to become a Champ! ⭐`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mt-3">
        {LEVELS.map((lvl, idx) => {
          const p = progress[lvl.id];
          const Icon = lvl.icon;
          return (
            <Link
              key={lvl.id}
              to={lvl.to}
              data-testid={`level-${lvl.id}`}
              className="toy-card p-4 sm:p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              <div className={`${lvl.color} w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-[0_6px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center text-white anim-bob`}>
                <Icon size={36} />
              </div>
              <div className="mt-3 font-extrabold text-slate-800 text-base sm:text-lg">{lvl.title}</div>
              <div className="text-xs text-slate-500 mb-2">Level {idx + 1}</div>
              <StarRow count={p?.stars || 0} testId={`level-${lvl.id}-stars`} />
            </Link>
          );
        })}
      </div>

      <div className="mt-6 toy-card p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Award className="text-amber-500" /> My Badges
          </h2>
          <p className="text-slate-500 text-sm">Total stars: {stars}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[
              { id: "starter", label: "🌟 Starter", need: 5 },
              { id: "explorer", label: "🚀 Explorer", need: 15 },
              { id: "champ", label: "🏆 Champ", need: 30 },
            ].map((b) => {
              const earned = badges.includes(b.id);
              return (
                <span
                  key={b.id}
                  data-testid={`badge-${b.id}`}
                  className={`px-3 py-1 rounded-full font-bold text-sm border-2 ${earned ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-slate-100 text-slate-400 border-slate-200"}`}
                >
                  {earned ? b.label : <><Lock size={12} className="inline mr-1" />{b.label} ({b.need})</>}
                </span>
              );
            })}
          </div>
        </div>
        <button
          data-testid="goto-certificate-btn"
          onClick={() => navigate("/certificate")}
          className={`toy-btn px-6 py-4 ${allDone ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-white" : "bg-slate-100 text-slate-500"}`}
        >
          {allDone ? "🎉 Get Certificate" : "Certificate"}
        </button>
      </div>
    </Layout>
  );
}
