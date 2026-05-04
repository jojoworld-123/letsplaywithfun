import { useState } from "react";

export const useTTS = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    // ✅ ONLY ENGLISH
    utter.lang = "en-IN";
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