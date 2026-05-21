import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px", background: "white",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
      }}>
        <span style={{ fontWeight: 800, fontSize: 22, color: "#166534" }}>LuXPREPA</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 20px", borderRadius: 8, border: "1.5px solid #166534",
            color: "#166534", fontWeight: 600, background: "white",
            cursor: "pointer", fontSize: 14
          }}>Se connecter</button>
          <button onClick={() => navigate("/register")} style={{
            padding: "8px 20px", borderRadius: 8, background: "#166534",
            color: "white", fontWeight: 600, border: "none",
            cursor: "pointer", fontSize: 14
          }}>S'inscrire</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "90px 20px 60px" }}>
        <div style={{
          display: "inline-block", background: "#dcfce7", color: "#166534",
          borderRadius: 20, padding: "6px 16px", fontSize: 13,
          fontWeight: 600, marginBottom: 20
        }}>🎯 Plateforme de préparation aux concours</div>

        <h1 style={{ fontSize: 44, fontWeight: 800, color: "#166534", margin: "0 0 16px", lineHeight: 1.2 }}>
          Réussissez votre concours<br />avec <span style={{ color: "#22c55e" }}>LuXPREPA</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 500, margin: "0 auto 36px" }}>
          La plateforme qui accompagne élèves, professeurs et parents vers l'excellence.
        </p>
        <button onClick={() => navigate("/register")} style={{
          padding: "15px 40px", borderRadius: 12, background: "#166534",
          color: "white", fontWeight: 700, fontSize: 16, border: "none",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(22,101,52,.35)"
        }}>Commencer gratuitement →</button>
      </div>

      {/* CARDS */}
      <div style={{
        display: "flex", justifyContent: "center",
        gap: 24, flexWrap: "wrap", padding: "0 20px 80px"
      }}>
        {[
          { icon: "🎓", title: "Élève", desc: "Accédez aux cours et exercices adaptés à votre niveau de préparation." },
          { icon: "👨‍🏫", title: "Professeur", desc: "Gérez vos classes et suivez la progression de vos élèves en temps réel." },
          { icon: "👨‍👩‍👧", title: "Parent", desc: "Suivez les résultats et l'évolution scolaire de votre enfant." },
        ].map(card => (
          <div key={card.title} style={{
            background: "white", borderRadius: 20, padding: "36px 28px",
            width: 260, boxShadow: "0 4px 20px rgba(22,101,52,0.10)",
            textAlign: "center", transition: "transform 0.2s"
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{card.icon}</div>
            <h3 style={{ fontWeight: 700, color: "#166534", margin: "0 0 10px", fontSize: 18 }}>{card.title}</h3>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center", padding: "20px",
        color: "#9ca3af", fontSize: 13,
        borderTop: "1px solid #e5e7eb", background: "white"
      }}>
        © 2026 LuXPREPA — Tous droits réservés
      </div>

    </div>
  );
}