import { useCallback, useEffect, useRef, useState } from "react";

// Web Speech API hook with female child-friendly voice preference.
export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const preferred = [
        "Google UK English Female",
        "Google US English",
        "Microsoft Zira",
        "Samantha",
        "Karen",
        "Tessa",
        "Veena",
      ];
      let chosen = voices.find((v) => preferred.includes(v.name));
      if (!chosen) chosen = voices.find((v) => /female|zira|samantha|karen|tessa/i.test(v.name));
      if (!chosen) chosen = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
      voiceRef.current = chosen || voices[0];
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text, opts = {}) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = opts.rate ?? 0.9;
      u.pitch = opts.pitch ?? 1.15;
      u.volume = opts.volume ?? 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch (_) {
      setSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

// Phonics letter sounds (single letter says letter name; can be customized).
export function letterSound(letter) {
  return letter; // browser TTS will say letter name; good enough for kids
}
