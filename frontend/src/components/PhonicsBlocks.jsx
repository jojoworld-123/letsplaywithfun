import { useTTS } from "../hooks/useTTS";

export default function PhonicsBlocks({ word, testId = "phonics-blocks" }) {
  const { speak } = useTTS();
  if (!word) return null;
  const letters = word.replace(/-/g, "").toUpperCase().split("");

  return (
    <div data-testid={testId} className="flex flex-wrap items-center justify-center gap-2 my-3">
      {letters.map((ch, i) => (
        <button
          key={`${ch}-${i}`}
          onClick={() => speak(ch)}
          data-testid={`phonics-letter-${i}`}
          className="bg-white border-2 border-sky-200 rounded-xl w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-sky-700 shadow-[0_3px_0_0_#7DD3FC] hover:bg-sky-50 active:translate-y-0.5 active:shadow-[0_1px_0_0_#7DD3FC] transition-all"
        >
          {ch}
        </button>
      ))}
    </div>
  );
}
