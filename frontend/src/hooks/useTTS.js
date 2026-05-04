import { useState } from "react";

export const useTTS = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text, lang = "en") => {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utter.rate = 0.9;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);

    synth.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speak, speaking, stop };
};