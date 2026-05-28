import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api";
import toast from "react-hot-toast";
import { BiLock } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import { BiCheckCircle } from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";
export default function VerifyCode() {
  const location = useLocation()
  const telephone = location.state?.telephone as string
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState<boolean>(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
    if (!telephone){
      navigate("/register")
    }
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

  const handleSubmit = async () => {
    const full = code.join("");
    if (full.length < 6) {
      setError("Veuillez entrer les 6 chiffres du code.");
      return;
    }
    setLoading(true);
    setError(null)
    try {
      const response = await authApi.confirmer({ telephone: telephone, code: full })
      setTimeout(() => {
        toast.success(response.message)
        toast.success(`Bienvenue ${response.user.prenom} ${response.user.nom}`)
        navigate("/");
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        console.log(error);
      }
    } finally {
      setLoading(false)
    }
  };

  const handleResend = async () => {
    setResent(true);
    setCode(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
    setError(null)
    try {
      await authApi.renvoyerCode(telephone)
      toast.success(`Nouveau code envoyé avec succès!`)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        console.log(error);
      }
    } finally {
      setLoading(false)
    }
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
          }}><BiLock color="white" size={25} /></div>
          <p style={{ color: "#8b949e", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
            Entrez le code à 6 chiffres envoyé au +237 {telephone}.
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
          <p className="flex flex-row items-center justify-center gap-2" style={{ color: "#f85149", fontSize: 12.5, margin: "8px 0 0" }}><FiAlertCircle size={20} color="orange"/> {error}</p>
        )}

        {/* Renvoi code */}
        {(resent && error===null) && (
          <p className="flex flex-row items-center justify-center gap-2" style={{ color: "#3fb950", fontSize: 12.5, margin: "10px 0 0" }}>
            <BiCheckCircle size={20} color="green"/>  Code renvoyé avec succès !
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
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
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
        <div className="flex flex-row items-center justify-center gap-2" style={{ marginTop: 12 }}>
          <span className="flex flex-row items-center justify-center gap-2" onClick={() => navigate("/register")} style={{
            color: "#8b949e", fontSize: 13, cursor: "pointer"
          }}><BiArrowBack size={15} color="white"/> <label className="hover:text-green-500">Retour à l'inscription</label></span>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}