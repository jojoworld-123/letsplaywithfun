import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import { useGame } from "../store/gameStore";
import { useTTS } from "../hooks/useTTS";
import { fireConfetti, fireStars } from "../components/Confetti";
import { Download, RefreshCw, Sparkles, Star } from "lucide-react";
import html2canvas from "html2canvas";
import axios from "axios";
import { TEACHER } from "../data/content";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CertificatePage() {
  const { name, studentClass, studentId, stars, badges, reset } = useGame();
  const { speak } = useTTS();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fireConfetti();
    fireStars();
    speak(`Congratulations ${name || "Champ"}! You completed Computer Champ. You are now a Computer Champion!`);
    if (studentId && !studentId.startsWith("local-")) {
      axios.post(`${API}/certificate/issue`, { student_id: studentId }).catch(() => {});
    }
    // eslint-disable-next-line
  }, []);

  const download = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFBEB",
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Computer-Champ-${(name || "Champ").replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      fireConfetti();
      speak("Certificate downloaded! Show it to your parents!");
    } catch (e) {
      speak("Could not download. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout title="🎉 Congratulations!" testId="certificate-page">
      <TeacherMascot
        message={`Brilliant ${name || "friend"}! Your free certificate is ready. Tap Download to save it!`}
      />

      {/* Certificate Preview */}
      <div className="overflow-x-auto no-scrollbar">
        <div
          ref={certRef}
          data-testid="certificate-preview"
          className="mx-auto my-3"
          style={{
            width: 720,
            maxWidth: "100%",
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FCE7F3 100%)",
            border: "12px solid #F59E0B",
            borderRadius: 24,
            padding: 32,
            position: "relative",
            fontFamily: "Fredoka, Nunito, sans-serif",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* corner stars */}
          <div style={{ position: "absolute", top: 12, left: 12, fontSize: 28 }}>⭐</div>
          <div style={{ position: "absolute", top: 12, right: 12, fontSize: 28 }}>⭐</div>
          <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 28 }}>🎈</div>
          <div style={{ position: "absolute", bottom: 12, right: 12, fontSize: 28 }}>🎈</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: 4, color: "#9333EA", fontWeight: 700 }}>
              ★ CERTIFICATE OF ACHIEVEMENT ★
            </div>
            <h1 style={{
              fontSize: 48,
              margin: "8px 0 4px",
              color: "#0EA5E9",
              fontWeight: 700,
              textShadow: "2px 2px 0 #FDE047",
            }}>
              Computer Champ
            </h1>
            <div style={{ fontSize: 16, color: "#475569" }}>This certificate is proudly presented to</div>

            <div style={{
              margin: "16px auto",
              padding: "12px 24px",
              display: "inline-block",
              background: "white",
              border: "4px dashed #F472B6",
              borderRadius: 16,
            }}>
              <div style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#DB2777",
              }}>
                {name || "Little Champ"}
              </div>
              <div style={{ fontSize: 18, color: "#64748B", marginTop: 4 }}>
                Class {studentClass}
              </div>
            </div>

            <div style={{ fontSize: 18, color: "#1E293B", margin: "12px 24px", lineHeight: 1.5 }}>
              Congratulations! You have successfully completed the
              <b style={{ color: "#0EA5E9" }}> Computer Learning Game</b>.
              <br />
              You learned <b>Computer Basics</b>, <b>Machines</b>, and <b>Natural Things</b>.
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "8px 0" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ fontSize: 32 }}>⭐</span>
              ))}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              marginTop: 24,
              fontSize: 14,
              color: "#475569",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 16 }}>{stars} Stars</div>
                <div>Total Earned</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <img
                  src={TEACHER.photo}
                  alt={TEACHER.name}
                  crossOrigin="anonymous"
                  style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "3px solid #F59E0B" }}
                />
                <div style={{ borderTop: "2px solid #94A3B8", marginTop: 4, paddingTop: 2, fontWeight: 700, color: "#1E293B" }}>
                  {TEACHER.fullName}
                </div>
                <div style={{ fontSize: 12 }}>Your Teacher</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 16 }}>{badges.length}</div>
                <div>Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-5">
        <button
          onClick={download}
          disabled={downloading}
          data-testid="certificate-download-btn"
          className="toy-btn bg-gradient-to-r from-emerald-400 to-sky-400 text-white px-6 py-4 text-xl flex items-center gap-2 disabled:opacity-60"
        >
          <Download /> {downloading ? "Preparing..." : "Download Certificate (FREE)"}
        </button>
        <a href="/levels" data-testid="certificate-back" className="toy-btn bg-white text-slate-700 border-slate-200 px-6 py-4 text-xl flex items-center gap-2">
          <Sparkles /> Play More
        </a>
        <button
          onClick={() => { reset(); window.location.href = "/"; }}
          data-testid="certificate-restart"
          className="toy-btn bg-rose-300 text-white px-6 py-4 text-xl flex items-center gap-2"
        >
          <RefreshCw /> New Player
        </button>
      </div>

      <div className="mt-6 toy-card p-5 text-center">
        <div className="flex justify-center gap-2 text-2xl mb-1">
          <Star className="text-amber-400" fill="#F59E0B" />
          <Star className="text-amber-400" fill="#F59E0B" />
          <Star className="text-amber-400" fill="#F59E0B" />
        </div>
        <p className="text-slate-600">
          Parents, this certificate is <b>completely free</b>. Tap Download to save the PNG image and print it for your child!
        </p>
      </div>
    </Layout>
  );
}
