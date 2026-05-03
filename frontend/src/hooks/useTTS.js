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

      // Priority order: Indian English female -> Indian English male -> Hindi -> any English female
      const indianFemaleNames = [
        "Microsoft Heera",
        "Microsoft Heera - English (India)",
        "Veena",
        "Google हिन्दी",
        "Lekha", // macOS Hindi
        "Rishi",
      ];

      // 1) Named Indian voices
      let chosen = voices.find((v) => indianFemaleNames.some((n) => v.name && v.name.toLowerCase().includes(n.toLowerCase())));

      // 2) Any en-IN voice (prefer female)
      if (!chosen) {
        const inEn = voices.filter((v) => v.lang && v.lang.toLowerCase() === "en-in");
        chosen = inEn.find((v) => /female|heera|veena|priya|kala|aditi/i.test(v.name)) || inEn[0];
      }

      // 3) Any hi-IN voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("hi"));
      }

      // 4) Fallback to a general English female
      if (!chosen) {
        const enFemale = ["Google UK English Female", "Microsoft Zira", "Samantha", "Karen", "Tessa"];
        chosen = voices.find((v) => enFemale.some((n) => v.name && v.name.toLowerCase().includes(n.toLowerCase())));
      }
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
      u.lang = (voiceRef.current && voiceRef.current.lang) || "en-IN";
      u.rate = opts.rate ?? 0.85;
      u.pitch = opts.pitch ?? 1.1;
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
