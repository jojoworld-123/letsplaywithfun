import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import TeacherMascot from "../components/TeacherMascot";
import { useGame } from "../store/gameStore";
import { useTTS } from "../hooks/useTTS";
import { fireConfetti, fireStars } from "../components/Confetti";
import { Download, RefreshCw, Sparkles, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// SVG medal component for crisp print quality
function Medal({ tone = "gold", label, size = 86 }) {
  const palette = {
    gold:   { ring: "#F59E0B", body: "#FCD34D", inner: "#FBBF24", text: "#7C2D12" },
    silver: { ring: "#94A3B8", body: "#E2E8F0", inner: "#CBD5E1", text: "#1E293B" },
    bronze: { ring: "#B45309", body: "#FBA94B", inner: "#F59E0B", text: "#7C2D12" },
  }[tone];
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", margin: "0 4px" }}>
      {/* ribbons */}
      <svg width={size} height={size * 1.45} viewBox="0 0 100 145">
        {/* left ribbon */}
        <path d="M22 0 L42 0 L52 60 L34 60 L18 12 Z" fill="#EF4444" />
        {/* right ribbon */}
        <path d="M58 0 L78 0 L82 12 L66 60 L48 60 Z" fill="#3B82F6" />
        {/* outer ring */}
        <circle cx="50" cy="95" r="35" fill={palette.ring} />
        {/* medal body */}
        <circle cx="50" cy="95" r="29" fill={palette.body} stroke="#fff" strokeWidth="2" />
        {/* inner star ring */}
        <circle cx="50" cy="95" r="20" fill={palette.inner} />
        {/* star */}
        <polygon
          points="50,80 53.5,90.5 64.5,90.5 55.5,97 59,107.5 50,101 41,107.5 44.5,97 35.5,90.5 46.5,90.5"
          fill="#fff"
        />
      </svg>
      <span style={{ fontWeight: 800, color: palette.text, fontSize: 12, marginTop: -6 }}>{label}</span>
    </div>
  );
}

export default function CertificatePage() {
  const { name, studentClass, studentId, stars, badges, reset, setNameClass } = useGame();
  const { speak } = useTTS();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [editName, setEditName] = useState(name && name !== "Champ" ? name : "");
  const [editClass, setEditClass] = useState(studentClass || "1");

  // Live update the store / preview as the parent types
  useEffect(() => {
    if (setNameClass) setNameClass(editName.trim() || "Little Champ", editClass);
    // eslint-disable-next-line
  }, [editName, editClass]);

  useEffect(() => {
    fireConfetti();
    fireStars();
    speak(`Congratulations! You completed Computer Champ. You are now a Computer Champion!`);
    if (studentId && !studentId.startsWith("local-")) {
      axios.post(`${API}/certificate/issue`, { student_id: studentId }).catch(() => {});
    }
    // eslint-disable-next-line
  }, []);

  const renderCanvas = async () => {
  const element = document.getElementById("certificate");

  // 🛑 IMPORTANT DELAY (state update ke liye)
  await new Promise((resolve) => setTimeout(resolve, 300));

  return await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#FFFBEF",
  });
};

  const downloadPNG = async () => {
  if (!certRef.current) return;

  setDownloading(true);

  try {
    // 🔥 IMPORTANT FIX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await renderCanvas();
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = `Computer-Champ-${editName}.png`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } finally {
    setDownloading(false);
  }
};

  const downloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await renderCanvas();
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Computer-Champ-${displayName}.pdf`)
      fireConfetti();
      speak("PDF certificate downloaded! Show it to your parents!");
    } catch {
      speak("Could not download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const displayName = (editName || name || "").trim() || "Little Champ";

  return (
    <Layout title="🎉 Congratulations!" testId="certificate-page">
      <TeacherMascot
        message={`Brilliant work! Type your name below, pick your class, and download your shiny certificate!`}
      />

      {/* Customization Card - prominent at top */}
      <div className="toy-card p-5 mb-4 bg-gradient-to-br from-pink-50 via-amber-50 to-sky-50">
        <h3 className="font-extrabold text-slate-800 text-lg mb-3 flex items-center gap-2">
          ✏️ Customize Your Certificate
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 text-sm mb-1 block">Child's Name</label>
            <input
              data-testid="certificate-name-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Type your full name..."
              maxLength={28}
              className="pill-input text-2xl py-3"
              autoFocus
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 text-sm mb-1 block">Class</label>
            <div className="grid grid-cols-2 gap-2">
              {["1", "2"].map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`certificate-class-${c}`}
                  onClick={() => setEditClass(c)}
                  className={`toy-btn py-3 text-lg ${editClass === c ? "bg-sky-400 text-white" : "bg-white text-sky-600 border-sky-200"}`}
                >
                  Class {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="overflow-x-auto no-scrollbar">
        <div
          ref={certRef}
          id="certificate"
          data-testid="certificate-preview"
          className="mx-auto my-3"
          style={{
            width: 760,
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
          {/* corner decorations */}
          <div style={{ position: "absolute", top: 12, left: 12, fontSize: 28 }}>⭐</div>
          <div style={{ position: "absolute", top: 12, right: 12, fontSize: 28 }}>⭐</div>
          <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 28 }}>🎈</div>
          <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 28 }}>🎈</div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: 4, color: "#9333EA", fontWeight: 700 }}>
              ★ CERTIFICATE OF ACHIEVEMENT ★
            </div>
            <h1
              style={{
                fontSize: 52,
                margin: "8px 0 4px",
                color: "#0EA5E9",
                fontWeight: 700,
                textShadow: "2px 2px 0 #FDE047",
              }}
            >
              Computer Champ
            </h1>
            <div style={{ fontSize: 16, color: "#475569" }}>This certificate is proudly presented to</div>

            <div
              style={{
                margin: "16px auto",
                padding: "14px 28px",
                display: "inline-block",
                background: "white",
                border: "4px dashed #F472B6",
                borderRadius: 18,
                minWidth: 280,
              }}
            >
              <div style={{ fontSize: 42, fontWeight: 700, color: "#DB2777" }}>{displayName}</div>
              <div style={{ fontSize: 18, color: "#64748B", marginTop: 4 }}>Class {editClass}</div>
            </div>

            <div style={{ fontSize: 18, color: "#1E293B", margin: "12px 24px", lineHeight: 1.5 }}>
              Congratulations! You have successfully completed the
              <b style={{ color: "#0EA5E9" }}> Computer Learning Game</b>.
              <br />
              You learned <b>Computer Basics</b>, <b>Machines</b>, and <b>Natural Things</b>.
            </div>

            {/* MEDALS row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                margin: "18px 0 8px",
                flexWrap: "wrap",
              }}
              data-testid="certificate-medals"
            >
              <Medal tone="gold" label="Knowledge" />
              <Medal tone="silver" label="Spelling" />
              <Medal tone="bronze" label="Speed" />
            </div>

            {/* Stars row */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ fontSize: 30 }}>⭐</span>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-end",
                marginTop: 20,
                fontSize: 14,
                color: "#475569",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 18 }}>{stars}</div>
                <div>Total Stars</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderTop: "2px solid #94A3B8",
                    paddingTop: 4,
                    fontWeight: 700,
                    color: "#1E293B",
                    fontSize: 16,
                    minWidth: 180,
                  }}
                >
                  Jyoti Singh
                </div>
                <div style={{ fontSize: 12 }}>Your Teacher</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 18 }}>{badges.length}</div>
                <div>Badges</div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 11, color: "#94A3B8" }}>
              Computer Champ · Class 1 & 2 Educational Game
            </div>
          </div>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-5">
        <button
          onClick={downloadPDF}
          disabled={downloading}
          data-testid="certificate-download-pdf"
          className="toy-btn bg-gradient-to-r from-rose-400 to-amber-400 text-white px-6 py-4 text-xl flex items-center gap-2 disabled:opacity-60"
        >
          <FileText /> Download PDF
        </button>
        <button
          onClick={downloadPNG}
          disabled={downloading}
          data-testid="certificate-download-png"
          className="toy-btn bg-gradient-to-r from-emerald-400 to-sky-400 text-white px-6 py-4 text-xl flex items-center gap-2 disabled:opacity-60"
        >
          <FileImage /> Download Image
        </button>
        <a
          href="/levels"
          data-testid="certificate-back"
          className="toy-btn bg-white text-slate-700 border-slate-200 px-6 py-4 text-xl flex items-center gap-2"
        >
          <Sparkles /> Play More
        </a>
        <button
          onClick={() => {
            reset();
            window.location.href = "/";
          }}
          data-testid="certificate-restart"
          className="toy-btn bg-rose-300 text-white px-6 py-4 text-xl flex items-center gap-2"
        >
          <RefreshCw /> New Player
        </button>
      </div>

      <div className="mt-6 toy-card p-5 text-center bg-gradient-to-r from-amber-50 to-pink-50">
        <div className="flex justify-center gap-2 text-3xl mb-2">🥇 🥈 🥉</div>
        <p className="text-slate-700 font-semibold">
          This certificate is <b className="text-emerald-600">100% FREE</b>! Type your child's name above, then download as <b>PDF</b> or <b>Image</b> to print at home.
        </p>
      </div>
    </Layout>
  );
}
