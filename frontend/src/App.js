import "./App.css";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import { useEffect } from "react";
import Contact from "./pages/Contact";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider, useGame } from "./store/gameStore";
import WelcomeScreen from "./pages/WelcomeScreen";
import LevelMap from "./pages/LevelMap";
import LearnMode from "./pages/LearnMode";
import PictureGame from "./pages/PictureGame";
import QuizGame from "./pages/QuizGame";
import MatchGame from "./pages/MatchGame";
import SpellGame from "./pages/SpellGame";
import MultitaskingGame from "./pages/MultitaskingGame";
import SpeedGame from "./pages/SpeedGame";
import JumbleGame from "./pages/JumbleGame";
import QAGame from "./pages/QAGame";
import TrueFalseGame from "./pages/TrueFalseGame";
import FillBlanksGame from "./pages/FillBlanksGame";
import BuildComputer from "./pages/BuildComputer";
import MemoryMatch from "./pages/MemoryMatch";
import OddOneOut from "./pages/OddOneOut";
import SortIt from "./pages/SortIt";
import CertificatePage from "./pages/Certificate";

function ProtectedRoute({ children }) {
  const { studentId } = useGame();
  if (!studentId) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const speak = (text) => {
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;

  setTimeout(() => {
    window.speechSynthesis.speak(speech);
  }, 100);
};
  return (
    <div className="App">
    <button onClick={() => speak("Welcome to Computer Champ")}>
  🔊 Start Voice
</button>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/levels" element={<ProtectedRoute><LevelMap /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><LearnMode /></ProtectedRoute>} />
<Route path="/about" element={<About />} />
            <Route path="/picture" element={<ProtectedRoute><PictureGame /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><MatchGame /></ProtectedRoute>} />
<Route path="/contact" element={<Contact />} />
            <Route path="/spell" element={<ProtectedRoute><SpellGame /></ProtectedRoute>} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/contact" element={<Contact />} />
            <Route path="/multitask" element={<ProtectedRoute><MultitaskingGame /></ProtectedRoute>} />
            <Route path="/speed" element={<ProtectedRoute><SpeedGame /></ProtectedRoute>} />
            <Route path="/jumble" element={<ProtectedRoute><JumbleGame /></ProtectedRoute>} />
            <Route path="/qa" element={<ProtectedRoute><QAGame /></ProtectedRoute>} />
            <Route path="/truefalse" element={<ProtectedRoute><TrueFalseGame /></ProtectedRoute>} />
            <Route path="/fill" element={<ProtectedRoute><FillBlanksGame /></ProtectedRoute>} />
            <Route path="/build" element={<ProtectedRoute><BuildComputer /></ProtectedRoute>} />
            <Route path="/memory" element={<ProtectedRoute><MemoryMatch /></ProtectedRoute>} />
            <Route path="/oddone" element={<ProtectedRoute><OddOneOut /></ProtectedRoute>} />
            <Route path="/sort" element={<ProtectedRoute><SortIt /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;
