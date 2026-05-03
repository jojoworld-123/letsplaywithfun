import "./App.css";
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
import CertificatePage from "./pages/Certificate";

function ProtectedRoute({ children }) {
  const { studentId } = useGame();
  if (!studentId) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/levels" element={<ProtectedRoute><LevelMap /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><LearnMode /></ProtectedRoute>} />
            <Route path="/picture" element={<ProtectedRoute><PictureGame /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><MatchGame /></ProtectedRoute>} />
            <Route path="/spell" element={<ProtectedRoute><SpellGame /></ProtectedRoute>} />
            <Route path="/multitask" element={<ProtectedRoute><MultitaskingGame /></ProtectedRoute>} />
            <Route path="/speed" element={<ProtectedRoute><SpeedGame /></ProtectedRoute>} />
            <Route path="/jumble" element={<ProtectedRoute><JumbleGame /></ProtectedRoute>} />
            <Route path="/qa" element={<ProtectedRoute><QAGame /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;
