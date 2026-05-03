import confetti from "canvas-confetti";

export function fireConfetti() {
  try {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FDE047", "#38BDF8", "#FB7185", "#A78BFA", "#34D399"],
    });
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
  } catch (_) {}
}

export function fireStars() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      shapes: ["star"],
      colors: ["#FDE047", "#FACC15", "#F59E0B"],
    });
  } catch (_) {}
}
