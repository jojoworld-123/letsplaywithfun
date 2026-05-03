import { TEACHER } from "../data/content";

export default function TeacherMascot({ message, side = "left", testId = "teacher-mascot" }) {
  return (
    <div
      data-testid={testId}
      className={`flex ${side === "right" ? "flex-row-reverse" : "flex-row"} items-end gap-3 my-4`}
    >
      <div className="relative flex-shrink-0 anim-bob">
        <img
          src={TEACHER.photo}
          alt={TEACHER.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-300 shadow-lg"
        />
        <span className="absolute -bottom-1 -right-1 bg-emerald-400 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white">
          {TEACHER.name.split(" ")[0]}
        </span>
      </div>
      {message ? (
        <div
          className={`relative bg-white rounded-2xl px-4 py-3 shadow-md border-2 border-slate-100 max-w-[80%] text-base sm:text-lg text-slate-800 ${side === "right" ? "rounded-br-none" : "rounded-bl-none"}`}
        >
          <span className="font-semibold text-sky-600 mr-1">{TEACHER.name}:</span>
          {message}
        </div>
      ) : null}
    </div>
  );
}
