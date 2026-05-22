import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.jpg';

import {
  FiSettings, FiCalendar, FiMapPin, FiDollarSign, FiClock,
  FiUsers, FiAward, FiLogIn, FiUserPlus, FiX, FiBookOpen,
  FiMonitor, FiRadio, FiTool, FiActivity, FiBriefcase,
} from "react-icons/fi";
import { GiMedicalPack } from "react-icons/gi";
import { MdConstruction } from "react-icons/md";

const concours = [
  {
    id: 1, nom: "ENSPD", ecole: "École Nationale Supérieure Polytechnique de Douala",
    Icon: FiSettings, statut: "actif",
    date: "15 Juin 2026", lieu: "Douala, ENSPD", montant: "12 000 FCFA", duree: "8 semaines",
    niveau: "Bac C/D/E", places: "150",
    matieres: ["Mathématiques", "Physique", "Chimie", "Informatique", "Français"]
  },
  {
    id: 2, nom: "IUT", ecole: "Institut Universitaire de Technologie",
    Icon: FiActivity, statut: "actif",
    date: "20 Juin 2026", lieu: "Douala / Bafoussam", montant: "8 000 FCFA", duree: "6 semaines",
    niveau: "Bac (toutes séries)", places: "300",
    matieres: ["Mathématiques", "Physique", "Logique & Raisonnement", "Français"]
  },
  {
    id: 3, nom: "Médecine", ecole: "Faculté de Médecine et des Sciences Biomédicales",
    Icon: GiMedicalPack, statut: "actif",
    date: "5 Juillet 2026", lieu: "Yaoundé, FMSB", montant: "15 000 FCFA", duree: "10 semaines",
    niveau: "Bac C/D", places: "200",
    matieres: ["Biologie", "Chimie", "Physique", "Mathématiques", "Français"]
  },
  {
    id: 4, nom: "ENSET", ecole: "École Normale Supérieure de l'Enseignement Technique",
    Icon: FiTool, statut: "bientot",
    date: "10 Juillet 2026", lieu: "Douala, ENSET", montant: "10 000 FCFA", duree: "7 semaines",
    niveau: "Bac+2 technique", places: "80",
    matieres: ["Mathématiques", "Physique", "Électronique", "Informatique"]
  },
  {
    id: 5, nom: "IAI-Cameroun", ecole: "Institut Africain d'Informatique",
    Icon: FiMonitor, statut: "bientot",
    date: "18 Juillet 2026", lieu: "Yaoundé, IAI", montant: "20 000 FCFA", duree: "8 semaines",
    niveau: "Bac ou Bac+2", places: "100",
    matieres: ["Mathématiques", "Informatique", "Logique", "Anglais", "Français"]
  },
  {
    id: 6, nom: "ENSPT", ecole: "École Nationale Supérieure des Postes et Télécommunications",
    Icon: FiRadio, statut: "bientot",
    date: "25 Juillet 2026", lieu: "Yaoundé, ENSPT", montant: "10 000 FCFA", duree: "6 semaines",
    niveau: "Bac+2", places: "60",
    matieres: ["Mathématiques", "Physique", "Électronique", "Informatique"]
  },
  {
    id: 7, nom: "EENSTP", ecole: "École des Travaux Publics",
    Icon: MdConstruction, statut: "bientot",
    date: "15 Août 2026", lieu: "Yaoundé", montant: "10 000 FCFA", duree: "7 semaines",
    niveau: "Bac C/D", places: "120",
    matieres: ["Mathématiques", "Physique", "Dessin Technique"]
  },
  {
    id: 8, nom: "ESSEC Douala", ecole: "École Supérieure des Sciences Économiques et Commerciales",
    Icon: FiBriefcase, statut: "passe",
    date: "10 Avril 2026", lieu: "Douala, ESSEC", montant: "15 000 FCFA", duree: "6 semaines",
    niveau: "Bac/Bac+1", places: "100",
    matieres: ["Mathématiques", "Économie", "Français", "Anglais", "Culture Générale"]
  },
  {
    id: 9, nom: "ENS", ecole: "École Normale Supérieure",
    Icon: FiBookOpen, statut: "passe",
    date: "20 Mars 2026", lieu: "Yaoundé, ENS", montant: "8 000 FCFA", duree: "5 semaines",
    niveau: "Bac", places: "200",
    matieres: ["Français", "Histoire-Géo", "Philosophie", "Mathématiques"]
  },
];

type Concour = typeof concours[0];

const pillClass = (statut: string) => {
  const base = "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit";
  if (statut === "actif") return `${base} bg-green-100 text-green-800`;
  if (statut === "bientot") return `${base} bg-yellow-100 text-yellow-800`;
  return `${base} bg-gray-100 text-gray-500`;
};

const StatutDot = ({ statut }: { statut: string }) => {
  if (statut === "actif") return <span className="w-2 h-2 rounded-full bg-green-500 inline-block shrink-0" />;
  if (statut === "bientot") return <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-gray-400 inline-block shrink-0" />;
};

const pillLabel = (statut: string) =>
  statut === "actif" ? "Actif" : statut === "bientot" ? "Bientôt" : "Passé";

export default function Concours() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("tous");
  const [modal, setModal] = useState<Concour | null>(null);

  const filtered = filtre === "tous" ? concours : concours.filter(c => c.statut === filtre);

  return (
    <div
      className="min-h-screen font-[Plus_Jakarta_Sans]"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
    >
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

      {/* HEADER */}
      <div className="bg-[#0a0a0a] px-20 py-10">
        <h1 className="font-[Clash_Display] text-4xl text-white m-0">
          Concours disponibles
        </h1>
        <p className="text-[#888] text-sm mt-1.5">
          Trouvez votre concours et commencez votre préparation dès aujourd'hui
        </p>
      </div>

      {/* FILTRES */}
      <div className="px-20 pt-5 flex gap-2.5 border-b border-gray-200 flex-wrap">
        {[
          { val: "tous", label: "Tous" },
          { val: "actif", label: "Actifs" },
          { val: "bientot", label: "Bientôt" },
          { val: "passe", label: "Passés" },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFiltre(f.val)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer mb-3 transition-colors ${
              filtre === f.val
                ? "bg-[#1a7c3e] text-white border-none"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
            }`}
          >
            {f.val !== "tous" && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                f.val === "actif" ? "bg-green-500" :
                f.val === "bientot" ? "bg-yellow-400" : "bg-gray-400"
              }`} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {/* GRILLE CONCOURS */}
      <div className="grid grid-cols-3 gap-5 px-20 pt-8 pb-14">
        {filtered.map(c => (
          <div
            key={c.id}
            className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col bg-white"
          >
            {/* Card header */}
            <div className="bg-gray-50 px-5 pt-6 pb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a7c3e]/10 flex items-center justify-center">
                  <c.Icon size={24} className="text-[#1a7c3e]" />
                </div>
                <span className={pillClass(c.statut)}>
                  <StatutDot statut={c.statut} />
                  {pillLabel(c.statut)}
                </span>
              </div>
              <div className="font-bold text-lg text-[#0a0a0a]">{c.nom}</div>
              <div className="text-gray-500 text-[13px] mt-1 leading-tight">{c.ecole}</div>
            </div>

            {/* Card body */}
            <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { Icon: FiCalendar, label: "Date", val: c.date },
                  { Icon: FiMapPin, label: "Lieu", val: c.lieu.split(",")[0] },
                  { Icon: FiDollarSign, label: "Frais", val: c.montant },
                  { Icon: FiClock, label: "Préparation", val: c.duree },
                ].map(d => (
                  <div key={d.label} className="flex gap-2 items-start">
                    <d.Icon size={14} className="text-[#1a7c3e] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-gray-400 font-semibold">{d.label}</div>
                      <div className="text-[13px] font-semibold text-gray-900">{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setModal(c)}
                className={`mt-auto w-full py-[11px] rounded-[10px] border-none font-bold text-sm cursor-pointer transition-opacity hover:opacity-90 ${
                  c.statut === "passe"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-[#1a7c3e] text-white"
                }`}
              >
                {c.statut === "passe" ? "Voir les détails →" : "Voir les détails & s'inscrire →"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-5"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-8"
          >
            {/* Modal header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-[#1a7c3e]/10 flex items-center justify-center shrink-0">
                    <modal.Icon size={26} className="text-[#1a7c3e]" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-extrabold m-0">{modal.nom}</h2>
                    <p className="text-gray-500 text-[13px] m-0">{modal.ecole}</p>
                  </div>
                </div>
                <span className={pillClass(modal.statut)}>
                  <StatutDot statut={modal.statut} />
                  {pillLabel(modal.statut)}
                </span>
              </div>
              <button
                onClick={() => setModal(null)}
                className="bg-gray-100 border-none rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition-colors text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal info grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { Icon: FiCalendar, label: "Date", val: modal.date },
                { Icon: FiMapPin, label: "Lieu", val: modal.lieu },
                { Icon: FiDollarSign, label: "Frais d'inscription", val: modal.montant },
                { Icon: FiClock, label: "Durée préparation", val: modal.duree },
                { Icon: FiAward, label: "Niveau requis", val: modal.niveau },
                { Icon: FiUsers, label: "Places disponibles", val: modal.places + " places" },
              ].map(d => (
                <div key={d.label} className="bg-gray-50 rounded-[10px] px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold mb-1">
                    <d.Icon size={11} />
                    {d.label}
                  </div>
                  <div className="text-sm font-bold text-gray-900">{d.val}</div>
                </div>
              ))}
            </div>

            {/* Matières */}
            <div className="mb-5">
              <div className="flex items-center gap-2 font-bold text-sm mb-2.5">
                <FiBookOpen size={15} className="text-[#1a7c3e]" />
                Matières au programme
              </div>
              <div className="flex flex-wrap gap-2">
                {modal.matieres.map(m => (
                  <span
                    key={m}
                    className="bg-[#d4f0df] text-green-800 rounded-full px-3 py-1 text-[13px] font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              disabled={modal.statut === "passe"}
              className={`w-full py-3.5 rounded-xl border-none font-bold text-[15px] transition-opacity flex items-center justify-center gap-2 ${
                modal.statut === "passe"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1a7c3e] text-white cursor-pointer hover:opacity-90"
              }`}
            >
              {modal.statut !== "passe" && <FiUserPlus size={17} />}
              {modal.statut === "passe" ? "Session terminée" : "S'inscrire à ce concours"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
