import { useEffect, useRef, useState } from "react";

export const useTTS = () => {
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState("en");
  const synthRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    synthRef.current = synth;

    const loadVoices = () => {
      voicesRef.current = synth.getVoices() || [];
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      if (synth) synth.onvoiceschanged = null;
    };
  }, []);

  const speak = (text, nextLang = lang) => {
    const synth = synthRef.current || (typeof window !== "undefined" ? window.speechSynthesis : null);
    if (!synth || !text) return;

    synth.cancel();

    const utter = new SpeechSynthesisUtterance(String(text));
    const targetLang = nextLang === "hi" ? "hi-IN" : "en-IN";

    utter.lang = targetLang;

    const voices = voicesRef.current;
    const preferredVoice =
      voices.find((v) => (v.lang || "").toLowerCase().startsWith(targetLang.toLowerCase())) ||
      voices.find((v) =>
        nextLang === "hi"
          ? (v.lang || "").toLowerCase().startsWith("hi")
          : (v.lang || "").toLowerCase().startsWith("en")
      ) ||
      null;

    if (preferredVoice) utter.voice = preferredVoice;

    utter.rate = nextLang === "hi" ? 0.92 : 0.96;
    utter.pitch = 1;
    utter.volume = 1;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    synth.speak(utter);
    setLang(nextLang);
  };

  const stop = () => {
    const synth = synthRef.current || (typeof window !== "undefined" ? window.speechSynthesis : null);
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  };

  return { speak, speaking, stop, lang, setLang };
};