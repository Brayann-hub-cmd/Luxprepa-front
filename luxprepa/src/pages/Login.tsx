import { useState } from "react";
import logo from '../images/logo.jpg'
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import {toast} from "react-hot-toast";
// ── Types ────────────────────────────────────────────────────
type Role = "eleve" | "prof";

// ── Eye Icon ─────────────────────────────────────────────────
const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="1.8" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8" fill="none"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

// ── Phone Icon ───────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#6b7280" strokeWidth="1.8" fill="none"/>
  </svg>
);

// ── Lock Icon ────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="1.8" fill="none"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// ── Main Login Component ──────────────────────────────────────
export default function Login() {
  const [role, setRole] = useState<Role>("eleve");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: appel API axios ici
    try {
      const response = await authApi.connexion({ telephone:phone, password: password })
      toast.success(response.message)
      setLoading(false)
      navigate('/')
    } catch (error) {
      setLoading(false)
    }
    // await api.post("/auth/login", { telephone: phone, password, role });
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 35%, #bbf7d0 70%, #86efac 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative background circles */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(134,239,172,.25)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(74,222,128,.2)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(187,247,208,.4)", pointerEvents: "none" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .login-card { animation: slideUp .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .role-tab { transition: all .22s ease; }
        .role-tab:hover { background: rgba(22,101,52,.08) !important; }
        .login-btn { transition: all .18s ease; }
        .login-btn:hover:not(:disabled) { background: #14532d !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,101,52,.35) !important; }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: .7; cursor: not-allowed; }
        .input-field { transition: border-color .2s, box-shadow .2s; }
        .signup-link { transition: color .15s; }
        .signup-link:hover { color: #14532d !important; text-decoration: underline; }
        .eye-btn { transition: opacity .15s; }
        .eye-btn:hover { opacity: .7; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin .8s linear infinite; }
      `}</style>

      {/* Card */}
      <div className="login-card" style={{
        background: "rgba(255,255,255,.88)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.9) inset",
        border: "1px solid rgba(255,255,255,.7)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img src={logo} className="h-[48px] w-auto" />
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#14532d",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}>
            Bienvenue à Luxprepa
          </h1>
          <p style={{
            fontSize: 13.5,
            color: "#6b7280",
            margin: 0,
            lineHeight: 1.5,
          }}>
            Nous vous souhaitons la bienvenue !<br />
          </p>
        </div>

        {/* Role selector */}
        <div style={{
          display: "flex",
          background: "#f0fdf4",
          borderRadius: 12,
          padding: 4,
          marginBottom: 28,
          border: "1px solid #bbf7d0",
        }}>
          {(["eleve" , "prof"] as Role[]).map((r) => (
            <button
              key={r}
              className="role-tab"
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                background: role === r ? "#166534" : "transparent",
                color: role === r ? "#fff" : "#6b7280",
                boxShadow: role === r ? "0 2px 8px rgba(22,101,52,.3)" : "none",
                letterSpacing: .2,
              }}
            >
              {r === "eleve" ? 
              <div className="flex flex-row items-center justify-center gap-4"><PiStudent size={25} color="grey"/> Élève</div>: 
              <div className="flex flex-row items-center justify-center gap-4"><GiTeacher size={25} color="grey"/> Professeur</div>}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Phone field */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 7,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: .3,
              textTransform: "uppercase",
            }}>
              Numéro de téléphone
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                display: "flex", alignItems: "center",
              }}>
                <PhoneIcon />
              </span>
              <input
                className="input-field"
                type="tel"
                placeholder="6XX XXX XXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  borderRadius: 12,
                  border: focusedField === "phone"
                    ? "2px solid #166534"
                    : "1.5px solid #d1fae5",
                  outline: "none",
                  fontSize: 14,
                  color: "#111827",
                  background: "#f9fffe",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: focusedField === "phone" ? "0 0 0 3px rgba(22,101,52,.1)" : "none",
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 7,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: .3,
              textTransform: "uppercase",
            }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                display: "flex", alignItems: "center",
              }}>
                <LockIcon />
              </span>
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 40px",
                  borderRadius: 12,
                  border: focusedField === "password"
                    ? "2px solid #166534"
                    : "1.5px solid #d1fae5",
                  outline: "none",
                  fontSize: 14,
                  color: "#111827",
                  background: "#f9fffe",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: focusedField === "password" ? "0 0 0 3px rgba(22,101,52,.1)" : "none",
                }}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 2,
                  display: "flex", alignItems: "center",
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "#166534", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Mot de passe oublié ?
              </span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "14px",
              background: "#166534",
              color: "#fff",
              border: "none",
              borderRadius: 13,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: "pointer",
              letterSpacing: .3,
              boxShadow: "0 4px 16px rgba(22,101,52,.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: "center", fontSize: 13.5, color: "#6b7280", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="signup-link" style={{ color: "#166534", fontWeight: 700, textDecoration: "none" }}>
            Inscrivez-vous
          </Link>
        </p>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 20, marginBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          En vous connectant, vous acceptez nos{" "}
          <Link to={"/condition-utilisation"} style={{ color: "#166534", cursor: "pointer" }}>conditions d'utilisation</Link>
        </p>
      </div>
    </div>
  );
}