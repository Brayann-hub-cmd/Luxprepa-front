import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

// ── Copie minimale des utils nécessaires ──
// (adapte selon ton vrai import path)
// import { authApi, tokenUtils } from "../api";

// ── Types locaux (déjà définis dans api.tsx) ──
interface LoginData {
  telephone: string;
  password: string;
}

// ─────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginData>({ telephone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.telephone || !form.password) {
      toast.error("Remplis tous les champs.");
      return;
    }
    setLoading(true);
    try {
      // ── Décommente et adapte quand authApi est importé ──
      // const { token, user } = await authApi.login(form);
      // tokenUtils.sauvegarder(token);
      // navigate(user.role === "admin" ? "/dashboard" : "/concours");
      toast.success("Connexion réussie !");
      navigate("/concours");
    } catch (err: any) {
      toast.error(err.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* ── Page wrapper ── */}
      <div className="login-root">
        {/* Fond décoratif */}
        <div className="login-bg">
          <div className="login-blob blob-1" />
          <div className="login-blob blob-2" />
          <div className="login-grid" />
        </div>

        {/* ── Carte centrale ── */}
        <div className="  login-card">
          {/* Logo / Brand */}
          <div className="login-brand">
            <span className="brand-lux">LuX</span>
            <span className="brand-prepa">PREPA</span>
          </div>

          <h1 className="login-title">Connexion</h1>
          <p className="login-sub">
              Accède à ta préparation aux concours
          </p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Téléphone */}
            <div className="field-group">
              <label htmlFor="telephone" className="field-label">
                Téléphone
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5
                      19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012
                      1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006
                      6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={form.telephone}
                  onChange={handleChange}
                  className="field-input"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="field-group">
              <label htmlFor="password" className="field-label">
                Mot de passe
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="field-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  {showPwd ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45
                        18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5
                        18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <ClipLoader color="#fff" size={18} />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Footer liens */}
          <div className="login-footer">
            <span>Pas encore inscrit ?</span>
            <Link to="/register" className="login-link">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

      {/* ── Styles scoped ── */}
      <style>{`
        /* ─── Reset / Root ─── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f1117;
          font-family: 'Segoe UI', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        /* ─── Background déco ─── */
        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
        }
        .blob-1 {
          width: 480px; height: 480px;
          background: #2d6a4f;
          top: -120px; left: -140px;
          animation: float 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 380px; height: 380px;
          background: #1b4332;
          bottom: -100px; right: -100px;
          animation: float 10s ease-in-out infinite reverse;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(45,106,79,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,106,79,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ─── Card ─── */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── Brand ─── */
        .login-brand {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 1.8rem;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .brand-lux  { color: #fff; }
        .brand-prepa { color: #52b788; }

        /* ─── Titres ─── */
        .login-title {
          font-size: 1.55rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.35rem;
        }
        .login-sub {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 2rem;
        }

        /* ─── Formulaire ─── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .field-input {
          width: 100%;
          padding: 0.75rem 2.8rem 0.75rem 2.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: #52b788;
          background: rgba(82,183,136,0.08);
        }

        .pwd-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .pwd-toggle:hover { color: rgba(255,255,255,0.7); }

        /* ─── Bouton ─── */
        .btn-login {
          margin-top: 0.4rem;
          width: 100%;
          padding: 0.85rem;
          background: #2d6a4f;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(45,106,79,0.35);
        }
        .btn-login:hover:not(:disabled) {
          background: #40916c;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(45,106,79,0.5);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ─── Footer ─── */
        .login-footer {
          margin-top: 1.6rem;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .login-link {
          color: #52b788;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-link:hover { color: #74c69d; text-decoration: underline; }
      `}</style>
    </>
  );
}
