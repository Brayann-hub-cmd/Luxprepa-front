import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[i] = val;
    setCode(newCode);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = () => {
    const full = code.join("");
    if (full.length < 6) {
      setError("Veuillez entrer les 6 chiffres du code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigate("/dashboard"); // décommentez quand prêt
      alert("Code vérifié avec succès !");
    }, 1500);
  };

  const handleResend = () => {
    setResent(true);
    setCode(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
    setTimeout(() => setResent(false), 4000);
  };

  const filled = code.every(c => c !== "");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: 20,
    }}>
      <div style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 12,
        padding: "32px 40px",
        width: "100%",
        maxWidth: 420,
        textAlign: "center",
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "#1a7c3e",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 22
          }}>🔐</div>
          <h1 style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            Vérification en deux étapes
          </h1>
          <p style={{ color: "#8b949e", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
            Entrez le code à 6 chiffres envoyé à votre adresse e-mail ou téléphone.
          </p>
        </div>

        {/* Champs code */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "28px 0 8px" }}>
          {code.map((val, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
              style={{
                width: 46, height: 54,
                textAlign: "center",
                fontSize: 22, fontWeight: 700,
                borderRadius: 8,
                border: error ? "1.5px solid #f85149" : val ? "1.5px solid #1a7c3e" : "1.5px solid #30363d",
                background: "#0d1117",
                color: "#e6edf3",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          ))}
        </div>

        {/* Erreur */}
        {error && (
          <p style={{ color: "#f85149", fontSize: 12.5, margin: "8px 0 0" }}>⚠️ {error}</p>
        )}

        {/* Renvoi code */}
        {resent && (
          <p style={{ color: "#3fb950", fontSize: 12.5, margin: "10px 0 0" }}>
            ✅ Code renvoyé avec succès !
          </p>
        )}

        {/* Bouton vérifier */}
        <button
          onClick={handleSubmit}
          disabled={!filled || loading}
          style={{
            width: "100%", marginTop: 24,
            padding: "12px", borderRadius: 8, border: "none",
            background: filled ? "#1a7c3e" : "#21262d",
            color: filled ? "#fff" : "#484f58",
            fontWeight: 700, fontSize: 15,
            cursor: filled ? "pointer" : "not-allowed",
            transition: "background 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Vérification...
            </>
          ) : "Vérifier le code"}
        </button>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #21262d", margin: "20px 0" }} />

        {/* Renvoyer */}
        <p style={{ color: "#8b949e", fontSize: 13 }}>
          Vous n'avez pas reçu de code ?{" "}
          <span onClick={handleResend} style={{
            color: "#58a6ff", cursor: "pointer", fontWeight: 600
          }}>Renvoyer</span>
        </p>

        {/* Retour */}
        <p style={{ marginTop: 12 }}>
          <span onClick={() => navigate("/login")} style={{
            color: "#8b949e", fontSize: 13, cursor: "pointer"
          }}>← Retour à la connexion</span>
        </p>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}