import { Volume2, Repeat } from "lucide-react";
import { useTTS } from "../hooks/useTTS";

export default function TTSButton({
  text,
  label = "Play",
  testId = "tts-button",
  size = "md"
}) {
  const { speak, speaking, stop } = useTTS();

  const dim =
    size === "sm" ? "w-12 h-12" :
    size === "lg" ? "w-20 h-20" :
    "w-16 h-16";

  const icon =
    size === "sm" ? 18 :
    size === "lg" ? 32 :
    24;

  const handle = () => {
    if (speaking) stop();
    else speak(text); // ✅ only English
  };

  return (
    <button
      onClick={handle}
      data-testid={testId}
      aria-label={label}
      className={`${dim} ${speaking ? "anim-pulse-ring" : ""} bg-amber-300 hover:bg-amber-400 text-slate-900 rounded-full shadow-[0_4px_0_0_#CA8A04] active:translate-y-1 active:shadow-[0_1px_0_0_#CA8A04] flex items-center justify-center transition-all`}
    >
      {speaking ? <Repeat size={icon} /> : <Volume2 size={icon} />}
    </button>
  );
}
``