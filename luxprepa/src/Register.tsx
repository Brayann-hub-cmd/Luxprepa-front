import { useState } from "react";

type Role = "eleve" | "professeur" | "parent";

const LuxprepaLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 26, color: "#166534", letterSpacing: -1 }}>Lu</span>
    <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 26, color: "#166534", letterSpacing: -1 }}>X</span>
    <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 26, color: "#111827", letterSpacing: -1 }}>PREPA</span>
  </div>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="1.8" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8" fill="none" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="1" y1="1" x2="23" y2="23" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const FieldIcon = ({ type }: { type: string }) => {
  const icons: Record<string, JSX.Element> = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6b7280" strokeWidth="1.8" fill="none" /><circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="1.8" fill="none" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#6b7280" strokeWidth="1.8" fill="none" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="1.8" fill="none" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" /><rect x="2" y="3" width="18" height="18" rx="2" stroke="#6b7280" strokeWidth="1.8" fill="none" /></>,
    city: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#6b7280" strokeWidth="1.8" fill="none" /><polyline points="9 22 9 12 15 12 15 22" stroke="#6b7280" strokeWidth="1.8" /></>,
    child: <><circle cx="12" cy="6" r="3" stroke="#6b7280" strokeWidth="1.8" fill="none" /><path d="M9 20v-4a3 3 0 0 1 6 0v4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M6 20v-2a5 5 0 0 1 2-4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" fill="none" /></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      {icons[type]}
    </svg>
  );
};

const ROLES = [
  { key: "eleve" as Role,      label: "Élève",       emoji: "👨‍🎓" },
  { key: "professeur" as Role, label: "Professeur",  emoji: "👨‍🏫" },
  { key: "parent" as Role,     label: "Parent",      emoji: "👨‍👩‍👦" },
];

export default function Register() {
  const [role, setRole] = useState<Role>("eleve");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nom: "", prenom: "", telephone: "", ville: "",
    specialite: "",
    nomEnfant: "", prenomEnfant: "",
    password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [focused, setFocused]             = useState<string | null>(null);

  const update = (key: string, val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const passwordMatch = form.confirmPassword === "" || form.password === form.confirmPassword;

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: 12,
    border: focused === field ? "2px solid #166534" : "1.5px solid #d1fae5",
    outline: "none",
    fontSize: 14,
    color: "#111827",
    background: "#f9fffe",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: focused === field ? "0 0 0 3px rgba(22,101,52,.1)" : "none",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
  });

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12.5, fontWeight: 700, color: "#374151",
    marginBottom: 7, fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: .3, textTransform: "uppercase",
  };

  const iconWrap: React.CSSProperties = {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordMatch) return;
    setLoading(true);
    // TODO: await api.post("/auth/register", { ...form, role });
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 35%, #bbf7d0 70%, #86efac 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(134,239,172,.25)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(74,222,128,.2)", pointerEvents: "none" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .reg-card { animation: slideUp .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .role-tab { transition: all .22s ease; cursor: pointer; }
        .role-tab:hover { opacity: .85; }
        .reg-btn { transition: all .18s ease; }
        .reg-btn:hover:not(:disabled) { background: #14532d !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,101,52,.35) !important; }
        .reg-btn:disabled { opacity:.7; cursor:not-allowed; }
        .back-btn { transition: all .15s; }
        .back-btn:hover { background: #e5e7eb !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin .8s linear infinite; }
      `}</style>

      <div className="reg-card" style={{
        background: "rgba(255,255,255,.9)",
        backdropFilter: "blur(20px)",
        borderRadius: 24, padding: "36px 32px 28px",
        width: "100%", maxWidth: 430,
        boxShadow: "0 20px 60px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.9) inset",
        border: "1px solid rgba(255,255,255,.7)",
        position: "relative", zIndex: 1,
      }}>

        {/* Logo + titre */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <LuxprepaLogo />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: "#14532d", margin: "0 0 4px" }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Rejoignez Luxprepa et préparez votre concours !
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: step >= s ? "#166534" : "#e5e7eb",
                color: step >= s ? "#fff" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: step >= s ? "0 2px 8px rgba(22,101,52,.3)" : "none",
                transition: "all .3s",
              }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 2, borderRadius: 2, background: step >= 2 ? "#166534" : "#e5e7eb", transition: "background .3s" }} />}
            </div>
          ))}
        </div>

        {/* Sélecteur de rôle — 3 boutons */}
        <div style={{ display: "flex", background: "#f0fdf4", borderRadius: 12, padding: 4, marginBottom: 22, border: "1px solid #bbf7d0", gap: 4 }}>
          {ROLES.map(r => (
            <button key={r.key} className="role-tab" onClick={() => setRole(r.key)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 9, border: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 12,
              background: role === r.key ? "#166534" : "transparent",
              color: role === r.key ? "#fff" : "#6b7280",
              boxShadow: role === r.key ? "0 2px 8px rgba(22,101,52,.3)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 16 }}>{r.emoji}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* ── ÉTAPE 1 ── */}
        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); setStep(2); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Nom + Prénom */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Nom</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><FieldIcon type="user" /></span>
                  <input placeholder="Kamga" value={form.nom} required
                    onChange={e => update("nom", e.target.value)} style={inputStyle("nom")}
                    onFocus={() => setFocused("nom")} onBlur={() => setFocused(null)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Prénom</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><FieldIcon type="user" /></span>
                  <input placeholder="Jean" value={form.prenom} required
                    onChange={e => update("prenom", e.target.value)} style={inputStyle("prenom")}
                    onFocus={() => setFocused("prenom")} onBlur={() => setFocused(null)} />
                </div>
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label style={labelStyle}>Numéro de téléphone</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="phone" /></span>
                <input type="tel" placeholder="6XX XXX XXX" value={form.telephone} required
                  onChange={e => update("telephone", e.target.value)} style={inputStyle("telephone")}
                  onFocus={() => setFocused("telephone")} onBlur={() => setFocused(null)} />
              </div>
            </div>

            {/* Ville */}
            <div>
              <label style={labelStyle}>Ville</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="city" /></span>
                <select value={form.ville} required onChange={e => update("ville", e.target.value)}
                  style={{ ...inputStyle("ville"), appearance: "none" as const }}
                  onFocus={() => setFocused("ville")} onBlur={() => setFocused(null)}>
                  <option value="">Sélectionner une ville</option>
                  {["Douala","Yaoundé","Bafoussam","Bamenda","Garoua","Maroua","Ngaoundéré","Buea","Limbe","Kribi"].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Spécialité — prof uniquement */}
            {role === "professeur" && (
              <div>
                <label style={labelStyle}>Matière enseignée</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><FieldIcon type="book" /></span>
                  <select value={form.specialite} required onChange={e => update("specialite", e.target.value)}
                    style={{ ...inputStyle("specialite"), appearance: "none" as const }}
                    onFocus={() => setFocused("specialite")} onBlur={() => setFocused(null)}>
                    <option value="">Sélectionner une matière</option>
                    {["Mathématiques","Physique-Chimie","SVT","Français","Anglais","Histoire-Géo","Philosophie","Économie","Droit","Informatique"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Nom + Prénom de l'enfant — parent uniquement */}
            {role === "parent" && (
              <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "14px 14px 10px", border: "1px solid #bbf7d0" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", margin: "0 0 12px", fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: "uppercase", letterSpacing: .3 }}>
                  👦 Informations de l'enfant
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Nom enfant</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrap}><FieldIcon type="child" /></span>
                      <input placeholder="Kamga" value={form.nomEnfant} required
                        onChange={e => update("nomEnfant", e.target.value)} style={inputStyle("nomEnfant")}
                        onFocus={() => setFocused("nomEnfant")} onBlur={() => setFocused(null)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Prénom enfant</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrap}><FieldIcon type="child" /></span>
                      <input placeholder="Junior" value={form.prenomEnfant} required
                        onChange={e => update("prenomEnfant", e.target.value)} style={inputStyle("prenomEnfant")}
                        onFocus={() => setFocused("prenomEnfant")} onBlur={() => setFocused(null)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="reg-btn" style={{
              marginTop: 4, padding: "13px", background: "#166534", color: "#fff",
              border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer",
              letterSpacing: .3, boxShadow: "0 4px 16px rgba(22,101,52,.28)",
            }}>
              Continuer →
            </button>
          </form>
        )}

        {/* ── ÉTAPE 2 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Mot de passe */}
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="lock" /></span>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={form.password} required onChange={e => update("password", e.target.value)}
                  style={{ ...inputStyle("password"), paddingRight: 44 }}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 2,
                  display: "flex", alignItems: "center",
                }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="lock" /></span>
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  value={form.confirmPassword} required onChange={e => update("confirmPassword", e.target.value)}
                  style={{
                    ...inputStyle("confirm"), paddingRight: 44,
                    borderColor: !passwordMatch ? "#ef4444" : focused === "confirm" ? "#166534" : "#d1fae5",
                  }}
                  onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 2,
                  display: "flex", alignItems: "center",
                }}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {!passwordMatch && form.confirmPassword !== "" && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Résumé */}
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "12px 14px", border: "1px solid #bbf7d0" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#166534", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>
                {ROLES.find(r => r.key === role)?.emoji} {ROLES.find(r => r.key === role)?.label}
              </p>
              <p style={{ margin: 0, color: "#374151", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>
                {form.prenom} {form.nom} · {form.telephone} · {form.ville}
              </p>
              {role === "parent" && form.nomEnfant && (
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>
                  Enfant : {form.prenomEnfant} {form.nomEnfant}
                </p>
              )}
              {role === "professeur" && form.specialite && (
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>
                  Matière : {form.specialite}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="back-btn" onClick={() => setStep(1)} style={{
                padding: "13px 18px", background: "#f0fdf4", color: "#166534",
                border: "1.5px solid #bbf7d0", borderRadius: 13, fontSize: 14, fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer",
              }}>
                ← Retour
              </button>
              <button type="submit" className="reg-btn"
                disabled={loading || !passwordMatch || form.password === ""}
                style={{
                  flex: 1, padding: "13px", background: "#166534", color: "#fff",
                  border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer",
                  letterSpacing: .3, boxShadow: "0 4px 16px rgba(22,101,52,.28)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                {loading ? (
                  <>
                    <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Inscription...
                  </>
                ) : "S'inscrire"}
              </button>
            </div>
          </form>
        )}

        {/* Lien connexion */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: 13.5, color: "#6b7280", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Vous avez déjà un compte ?{" "}
          <a href="/login" style={{ color: "#166534", fontWeight: 700, textDecoration: "none" }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}