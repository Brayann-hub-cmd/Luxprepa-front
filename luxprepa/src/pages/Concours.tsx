import { useState } from "react";
import { useNavigate } from "react-router-dom";

const concours = [
  { id:1, nom:"ENSPD", ecole:"École Nationale Supérieure Polytechnique de Douala", icon:"⚙️", statut:"actif",
    date:"15 Juin 2026", lieu:"Douala, ENSPD", montant:"12 000 FCFA", duree:"8 semaines",
    niveau:"Bac C/D/E", places:"150", matieres:["Mathématiques","Physique","Chimie","Informatique","Français"] },
  { id:2, nom:"IUT", ecole:"Institut Universitaire de Technologie", icon:"🔬", statut:"actif",
    date:"20 Juin 2026", lieu:"Douala / Bafoussam", montant:"8 000 FCFA", duree:"6 semaines",
    niveau:"Bac (toutes séries)", places:"300", matieres:["Mathématiques","Physique","Logique & Raisonnement","Français"] },
  { id:3, nom:"Médecine", ecole:"Faculté de Médecine et des Sciences Biomédicales", icon:"🩺", statut:"actif",
    date:"5 Juillet 2026", lieu:"Yaoundé, FMSB", montant:"15 000 FCFA", duree:"10 semaines",
    niveau:"Bac C/D", places:"200", matieres:["Biologie","Chimie","Physique","Mathématiques","Français"] },
  { id:4, nom:"ENSET", ecole:"École Normale Supérieure de l'Enseignement Technique", icon:"🛠️", statut:"bientot",
    date:"10 Juillet 2026", lieu:"Douala, ENSET", montant:"10 000 FCFA", duree:"7 semaines",
    niveau:"Bac+2 technique", places:"80", matieres:["Mathématiques","Physique","Électronique","Informatique"] },
  { id:5, nom:"IAI-Cameroun", ecole:"Institut Africain d'Informatique", icon:"💻", statut:"bientot",
    date:"18 Juillet 2026", lieu:"Yaoundé, IAI", montant:"20 000 FCFA", duree:"8 semaines",
    niveau:"Bac ou Bac+2", places:"100", matieres:["Mathématiques","Informatique","Logique","Anglais","Français"] },
  { id:6, nom:"ENSPT", ecole:"École Nationale Supérieure des Postes et Télécommunications", icon:"📡", statut:"bientot",
    date:"25 Juillet 2026", lieu:"Yaoundé, ENSPT", montant:"10 000 FCFA", duree:"6 semaines",
    niveau:"Bac+2", places:"60", matieres:["Mathématiques","Physique","Électronique","Informatique"] },
  { id:7, nom:"EENSTP", ecole:"École des Travaux Publics", icon:"🏗️", statut:"bientot",
    date:"15 Août 2026", lieu:"Yaoundé", montant:"10 000 FCFA", duree:"7 semaines",
    niveau:"Bac C/D", places:"120", matieres:["Mathématiques","Physique","Dessin Technique"] },
  { id:8, nom:"ESSEC Douala", ecole:"École Supérieure des Sciences Économiques et Commerciales", icon:"💼", statut:"passe",
    date:"10 Avril 2026", lieu:"Douala, ESSEC", montant:"15 000 FCFA", duree:"6 semaines",
    niveau:"Bac/Bac+1", places:"100", matieres:["Mathématiques","Économie","Français","Anglais","Culture Générale"] },
  { id:9, nom:"ENS", ecole:"École Normale Supérieure", icon:"📖", statut:"passe",
    date:"20 Mars 2026", lieu:"Yaoundé, ENS", montant:"8 000 FCFA", duree:"5 semaines",
    niveau:"Bac", places:"200", matieres:["Français","Histoire-Géo","Philosophie","Mathématiques"] },
];

type Concour = typeof concours[0];

export default function Concours() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("tous");
  const [modal, setModal] = useState<Concour | null>(null);

  const filtered = filtre === "tous" ? concours : concours.filter(c => c.statut === filtre);

  const pillStyle = (statut: string) => ({
    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
    background: statut === "actif" ? "#dcfce7" : statut === "bientot" ? "#fef9c3" : "#f3f4f6",
    color: statut === "actif" ? "#166534" : statut === "bientot" ? "#854d0e" : "#6b7280",
  });

  const pillLabel = (statut: string) =>
    statut === "actif" ? "🟢 Actif" : statut === "bientot" ? "🟡 Bientôt" : "⚫ Passé";

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64
      }}>
        <span onClick={() => navigate("/")} style={{
          fontWeight: 800, fontSize: 20, color: "#1a7c3e", cursor: "pointer"
        }}>LuXPREPA</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 20px", borderRadius: 8, border: "1.5px solid #1a7c3e",
            color: "#1a7c3e", fontWeight: 600, background: "white", cursor: "pointer", fontSize: 14
          }}>Se connecter</button>
          <button onClick={() => navigate("/register")} style={{
            padding: "8px 20px", borderRadius: 8, background: "#1a7c3e",
            color: "white", fontWeight: 600, border: "none", cursor: "pointer", fontSize: 14
          }}>S'inscrire</button>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ background: "#0a0a0a", padding: "40px 80px" }}>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 36, color: "#fff", margin: 0 }}>
          Concours disponibles
        </h1>
        <p style={{ color: "#888", fontSize: 14, marginTop: 6 }}>
          Trouvez votre concours et commencez votre préparation dès aujourd'hui
        </p>
      </div>

      {/* FILTRES */}
      <div style={{
        padding: "20px 80px 0", display: "flex", gap: 10,
        borderBottom: "1px solid #e5e7eb", flexWrap: "wrap"
      }}>
        {[
          { val: "tous", label: "Tous" },
          { val: "actif", label: "🟢 Actifs" },
          { val: "bientot", label: "🟡 Bientôt" },
          { val: "passe", label: "⚫ Passés" },
        ].map(f => (
          <button key={f.val} onClick={() => setFiltre(f.val)} style={{
            padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600,
            cursor: "pointer", marginBottom: 12,
            border: filtre === f.val ? "none" : "1.5px solid #e5e7eb",
            background: filtre === f.val ? "#1a7c3e" : "#fff",
            color: filtre === f.val ? "#fff" : "#666",
          }}>{f.label}</button>
        ))}
      </div>

      {/* GRILLE CONCOURS */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20, padding: "32px 80px 56px"
      }}>
        {filtered.map(c => (
          <div key={c.id} style={{
            border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ background: "#f9fafb", padding: "24px 20px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{c.icon}</span>
                <span style={pillStyle(c.statut)}>{pillLabel(c.statut)}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0a0a0a" }}>{c.nom}</div>
              <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{c.ecole}</div>
            </div>
            <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { icon: "📅", label: "Date", val: c.date },
                  { icon: "📍", label: "Lieu", val: c.lieu.split(",")[0] },
                  { icon: "💰", label: "Frais", val: c.montant },
                  { icon: "⏱️", label: "Préparation", val: c.duree },
                ].map(d => (
                  <div key={d.label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{d.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setModal(c)} style={{
                marginTop: "auto", width: "100%", padding: "11px",
                borderRadius: 10, border: "none",
                background: c.statut === "passe" ? "#f3f4f6" : "#1a7c3e",
                color: c.statut === "passe" ? "#6b7280" : "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}>
                {c.statut === "passe" ? "Voir les détails" : "Voir les détails & s'inscrire"} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div onClick={() => setModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
            maxHeight: "90vh", overflowY: "auto", padding: 32
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 32 }}>{modal.icon}</span>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{modal.nom}</h2>
                    <p style={{ color: "#666", fontSize: 13, margin: 0 }}>{modal.ecole}</p>
                  </div>
                </div>
                <span style={pillStyle(modal.statut)}>{pillLabel(modal.statut)}</span>
              </div>
              <button onClick={() => setModal(null)} style={{
                background: "#f3f4f6", border: "none", borderRadius: 8,
                padding: "6px 12px", cursor: "pointer", fontSize: 16
              }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { icon: "📅", label: "Date", val: modal.date },
                { icon: "📍", label: "Lieu", val: modal.lieu },
                { icon: "💰", label: "Frais d'inscription", val: modal.montant },
                { icon: "⏱️", label: "Durée préparation", val: modal.duree },
                { icon: "🎓", label: "Niveau requis", val: modal.niveau },
                { icon: "👥", label: "Places disponibles", val: modal.places + " places" },
              ].map(d => (
                <div key={d.label} style={{
                  background: "#f9fafb", borderRadius: 10, padding: "12px 14px"
                }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{d.icon} {d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{d.val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Matières au programme</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {modal.matieres.map(m => (
                  <span key={m} style={{
                    background: "#d4f0df", color: "#166534",
                    borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600
                  }}>{m}</span>
                ))}
              </div>
            </div>

            <button disabled={modal.statut === "passe"} style={{
              width: "100%", padding: 14, borderRadius: 12, border: "none",
              background: modal.statut === "passe" ? "#e5e7eb" : "#1a7c3e",
              color: modal.statut === "passe" ? "#9ca3af" : "#fff",
              fontWeight: 700, fontSize: 15,
              cursor: modal.statut === "passe" ? "not-allowed" : "pointer"
            }}>
              {modal.statut === "passe" ? "Session terminée" : "S'inscrire à ce concours"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}