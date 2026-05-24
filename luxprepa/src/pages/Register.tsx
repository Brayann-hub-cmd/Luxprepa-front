import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";
import { SiLevelsdotfyi } from "react-icons/si";
import { RiParentFill } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";
type Role = "eleve" | "parent";
import { authApi } from "../api";
import toast from "react-hot-toast";

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
  const icons: Record<string, React.ReactNode> = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6b7280" strokeWidth="1.8" fill="none" /><circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="1.8" fill="none" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#6b7280" strokeWidth="1.8" fill="none" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="1.8" fill="none" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" /></>,
    child: <><circle cx="12" cy="6" r="3" stroke="#6b7280" strokeWidth="1.8" fill="none" /><path d="M9 20v-4a3 3 0 0 1 6 0v4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M6 20v-2a5 5 0 0 1 2-4" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" fill="none" /></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      {icons[type]}
    </svg>
  );
};

const ROLES = [
  { key: "eleve" as Role, label: "Élève", emoji: <PiStudent size={20} /> },
  { key: "parent" as Role, label: "Parent", emoji: <RiParentFill size={20} /> },
];

export default function Register() {
  const [role, setRole] = useState<Role>("eleve");
  const [step, setStep] = useState(1);
  type Roles = "eleve" | "prof" | "admin"
  const [form, setForm] = useState({
    nom: "", prenom: "", telephone: "",
    password: "", role: "eleve" as Roles, niveau: "tle", date_naissance: "", tel_parent: ""
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null)
  const [erreurTelephone,setErreurTelephone] = useState<string | null>(null)
  const [mdp,setMdp] = useState<string | null>(null)
  const navigate = useNavigate()
  const update = (key: string, val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const passwordMatch = confirmPassword === "" || form.password === confirmPassword;
  const validerTelephone = (tel: string): string | null => {
    if(tel.length===0) return null
    if (!/^\d+$/.test(tel)) return "Le numéro ne doit contenir que des chiffres"
    if (tel.length < 9) return "Le numéro doit contenir 9 chiffres"
    if (tel[0]!=="6") return "Le numéro doit commencer par 6"
    return null
  }
  const validerMdp = (mdp:string):string | null =>{
    if (mdp.length===0) return null
    if (mdp.length < 6) return "Le numéro doit contenir au moins 6 caractères"
    if (mdp.length > 8) return "Le numéro doit contenir au plus 8 caractères"
    return null 
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "telephone") {
      const valeurPropre = value.replace(/\D/g, "")
      if (valeurPropre.length > 9) return
      setForm({ ...form, telephone: valeurPropre })
      setErreurTelephone(validerTelephone(valeurPropre))
      return
    }
    if (name === "tel_parent") {
      const valeurPropre = value.replace(/\D/g, "")
      if (valeurPropre.length > 9) return
      setForm({ ...form, tel_parent: valeurPropre })
      setErreurTelephone(validerTelephone(valeurPropre))
      return
    }
    if (name === "password"){
      setForm({ ...form, password: value })
      setMdp(validerMdp(value))
      return 
    }
    setForm({...form,[name]:value})
  }

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
    const erreurTel = validerTelephone(form.telephone)
    const erreurTelParent = validerTelephone(form.tel_parent)
    const errPas = validerMdp(form.password)
    if (erreurTel){
      setErreurTelephone(erreurTel)
      return
    }
    if (erreurTelParent){
      setErreurTelephone(erreurTelParent)
      return
    }
    if (errPas){
      setMdp(errPas)
      return
    }
    setLoading(true);
    setErreur(null)
    try {
      const response = await authApi.preInscription(form)
      toast.success(response.message)
      if (response.message) {
        navigate('/verify', { state: { telephone: form.telephone } })
      }
    } catch (error) {
      if (error instanceof Error) {
        setErreur(error.message)
        console.log(erreur);
      }
    } finally {
      setLoading(false)
    }
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

        {/* Sélecteur de rôle — 2 boutons */}
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
                <input type="tel" placeholder="6XX XXX XXX" value={form.telephone} name="telephone" required
                  onChange={handleChange} style={inputStyle("telephone")}
                  onFocus={() => setFocused("telephone")} inputMode="numeric" onBlur={() => setFocused(null)} />
                  
              </div>
              {erreurTelephone && (<p style={{color:'red'}}>{erreurTelephone}</p>)}
            </div>
            <div>
              <label style={labelStyle}>Date de naissance</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><BiCalendar size={20} color="grey" /></span>
                <input type="date" value={form.date_naissance} required
                  onChange={e => update("date_naissance", e.target.value)} style={inputStyle("date_naissance")}
                  onFocus={() => setFocused("date_naissance")} onBlur={() => setFocused(null)} />
              </div>
            </div>

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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Tél. Parent</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><RiParentFill size={20} color="grey" /></span>
                  <input placeholder="6XX XXX XXX" value={form.tel_parent} name="tel_parent" required
                    onChange={handleChange} style={inputStyle("tel_parent")}
                    onFocus={() => setFocused("tel_parent")} inputMode="numeric" onBlur={() => setFocused(null)} />
                </div>
                {erreurTelephone && (<p style={{color:'red'}}>{erreurTelephone}</p>)}
              </div>
              <div>
                <label style={labelStyle}>Niveau</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><SiLevelsdotfyi size={20} color="grey" /></span>
                  <select value={form.niveau} required
                    onChange={e => update("niveau", e.target.value)} style={inputStyle("niveau")}
                    onFocus={() => setFocused("niveau")} onBlur={() => setFocused(null)} >
                    <option value="tle">** Terminale **</option>
                    <option value="post_bac">** BACC + **</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Mot de passe */}
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="lock" /></span>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={form.password} required onChange={handleChange} name="password"
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
              {mdp && <p style={{color:'red'}}>{mdp}</p>}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><FieldIcon type="lock" /></span>
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  value={confirmPassword} required onChange={e => setConfirmPassword(e.target.value)}
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
              {!passwordMatch && confirmPassword !== "" && (
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
                {form.prenom} {form.nom} · {form.telephone}
              </p>
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
        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 20, marginBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          En vous inscrivant, vous acceptez nos{" "}
          <Link to={"/condition-utilisation"} style={{ color: "#166534", cursor: "pointer" }}>conditions d'utilisation</Link>
        </p>
      </div>
    </div>
  );
}