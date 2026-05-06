import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Star } from "lucide-react";
import { useGame } from "../store/gameStore";

export default function Layout({ children, title, testId = "layout", showBack = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { stars } = useGame();
  const isHome = location.pathname === "/levels" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b-2 border-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {showBack && !isHome && (
            <button
              onClick={() => navigate(-1)}
              data-testid="back-button"
              aria-label="Back"
              className="w-11 h-11 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <Link to="/levels" data-testid="home-link" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-amber-300 border-2 border-white shadow flex items-center justify-center">
              <Home size={20} />
            </span>
            <span className="font-extrabold text-lg sm:text-xl text-sky-700 hidden sm:block">Computer Champ</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span
              data-testid="star-counter"
              className="flex items-center gap-1 bg-amber-100 border-2 border-amber-300 rounded-full px-3 py-1 font-extrabold text-amber-700"
            >
              <Star size={18} fill="#F59E0B" stroke="#F59E0B" />
              {stars}
            </span>
          </div>
        </div>
      </header>
      <main data-testid={testId} className="max-w-3xl mx-auto px-4 py-5 pb-24">
  {title ? (
    <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-700 mb-3 anim-pop">
      {title}
    </h1>
  ) : null}

  {children}
</main>

<footer className="text-center text-sm text-slate-500 pb-6">
  <div className="flex justify-center gap-4 flex-wrap">
    <Link to="/about" className="hover:text-sky-700">
      About
    </Link>

    <Link to="/privacy" className="hover:text-sky-700">
      Privacy Policy
    </Link>

    <Link to="/contact" className="hover:text-sky-700">
      Contact
    </Link>
  </div>

  <p className="mt-3">
    © 2026 Computer Champ by Jyoti Singh
  </p>
</footer>
</div>
);
}