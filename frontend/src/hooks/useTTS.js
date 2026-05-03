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

      // Highest priority: clear, kid-friendly female English voices with great pronunciation
      const preferredFemale = [
        "Google US English",
        "Google UK English Female",
        "Microsoft Aria Online (Natural) - English (United States)",
        "Microsoft Jenny Online (Natural) - English (United States)",
        "Microsoft Aria",
        "Microsoft Jenny",
        "Microsoft Zira",
        "Microsoft Zira - English (United States)",
        "Samantha",
        "Karen",
        "Tessa",
        "Moira",
        "Fiona",
      ];

      // 1) Try exact preferred female voices
      let chosen = voices.find((v) =>
        preferredFemale.some((n) => v.name && v.name.toLowerCase() === n.toLowerCase())
      );

      // 2) Try contains-match for natural/female English voices
      if (!chosen) {
        chosen = voices.find(
          (v) =>
            v.lang &&
            /^en[-_](us|gb|au)/i.test(v.lang) &&
            /female|aria|jenny|zira|samantha|karen|tessa|moira|fiona|natural/i.test(v.name)
        );
      }

      // 3) Any en-US or en-GB voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang && /^en[-_](us|gb)/i.test(v.lang));
      }

      // 4) Any English voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
      }

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
      // Force clear English locale (US) so the engine uses crisp pronunciation
      u.lang = (voiceRef.current && voiceRef.current.lang) || "en-US";
      // Slow + slightly higher pitch = warm, friendly teacher voice that kids understand
      u.rate = opts.rate ?? 0.85;
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
