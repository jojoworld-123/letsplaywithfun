import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GameContext = createContext(null);

const STORAGE_KEY = "computer-champ-state";

const defaultState = {
  studentId: null,
  name: "",
  studentClass: "1",
  stars: 0,
  badges: [],
  progress: {}, // { levelId: { stars, completed } }
};

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultState, ...JSON.parse(raw) };
    } catch (_) {}
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const registerStudent = useCallback(async (name, studentClass) => {
    try {
      const res = await axios.post(`${API}/students`, { name, student_class: studentClass });
      setState((s) => ({ ...s, studentId: res.data.id, name, studentClass, stars: 0, badges: [], progress: {} }));
      return res.data;
    } catch (e) {
      // Allow offline play even if backend fails
      const localId = `local-${Date.now()}`;
      setState((s) => ({ ...s, studentId: localId, name, studentClass, stars: 0, badges: [], progress: {} }));
      return { id: localId, name, student_class: studentClass };
    }
  }, []);

  const recordLevel = useCallback(async (levelId, stars) => {
    setState((s) => {
      const prev = s.progress[levelId] || { stars: 0, completed: false };
      const newStars = Math.max(prev.stars, stars);
      const progress = { ...s.progress, [levelId]: { stars: newStars, completed: true } };
      const total = Object.values(progress).reduce((a, b) => a + (b.stars || 0), 0);
      const badges = [...s.badges];
      if (total >= 5 && !badges.includes("starter")) badges.push("starter");
      if (total >= 15 && !badges.includes("explorer")) badges.push("explorer");
      if (total >= 30 && !badges.includes("champ")) badges.push("champ");
      return { ...s, progress, stars: total, badges };
    });
    try {
      if (state.studentId && !state.studentId.startsWith("local-")) {
        await axios.post(`${API}/scores`, {
          student_id: state.studentId,
          level_id: levelId,
          stars,
          completed: true,
        });
      }
    } catch (_) {}
  }, [state.studentId]);

  const reset = useCallback(() => {
    setState(defaultState);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }, []);

  const setNameClass = useCallback((newName, newClass) => {
    setState((s) => ({ ...s, name: newName, studentClass: newClass || s.studentClass }));
  }, []);

  return (
    <GameContext.Provider value={{ ...state, registerStudent, recordLevel, reset, setNameClass }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
