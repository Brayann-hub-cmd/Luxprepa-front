import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jpg'
import { BiArrowToRight } from "react-icons/bi";
import { FiLogIn,FiUserPlus } from "react-icons/fi";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-200 flex items-center justify-between px-12 h-16">
        <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
          <img src={logo} className="h-12 w-auto" alt="logo" />
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#1a7c3e] text-[#1a7c3e] font-semibold bg-white cursor-pointer text-sm hover:bg-green-50 transition-colors"
          >
            <FiLogIn size={15} />
            Se connecter
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a7c3e] text-white font-semibold border-none cursor-pointer text-sm hover:bg-green-800 transition-colors"
          >
            <FiUserPlus size={15} />
            S'inscrire
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center" style={{ textAlign: "center", padding: "90px 20px 60px" }}>
        <div style={{
          display: "inline-block", background: "#dcfce7", color: "#166534",
          borderRadius: 20, padding: "6px 16px", fontSize: 13,
          fontWeight: 600, marginBottom: 20
        }}>Plateforme d'un groupe de préparation aux concours d'entrée de grandes universités au Cameroun.</div>

        <h1 style={{ fontSize: 44, fontWeight: 800, color: "#166534", margin: "0 0 16px", lineHeight: 1.2 }}>
          Réussissez vos concours<br />avec <span style={{ color: "#22c55e" }}>LuXPREPA</span>
        </h1>
        <p className="text-justify" style={{ fontSize: 17, color: "#6b7280", maxWidth: 500, margin: "0 auto 36px" }}>
          La plateforme qui accompagne les élèves. Des anciens sujets corrigés, des examens type concours chaque semaines, assistance à la constitution de vos dossiers de concours, preparations journalières intensives avec des professeurs qui savent partager leur savoir. 
        </p>
        <button className="flex flex-row items-center justify-center" onClick={() => navigate("/register")} style={{
          padding: "15px 40px", borderRadius: 12, background: "#576b5f",
          color: "white", fontWeight: 700, fontSize: 16, border: "none",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(22,101,52,.35)"
        }}>Commencer gratuitement <BiArrowToRight size={20}/></button>
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