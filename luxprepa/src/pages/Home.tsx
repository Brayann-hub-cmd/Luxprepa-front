import { useState } from "react";
import type { FC, MouseEvent } from "react";
import type { IconType } from "react-icons";
import {
  FiTarget, FiBook, FiCalendar, FiFileText, FiChevronRight,
  FiMapPin, FiPhone, FiX, FiUsers, FiClock, FiDollarSign,
  FiAward,
} from "react-icons/fi";
import {
  MdOutlineElectricBolt,
} from "react-icons/md";
import {
  PiMathOperationsBold, PiAtomBold, PiFlaskBold, PiDnaBold,
  PiCodeBold, PiPencilBold, PiGlobeBold, PiChartBarBold,
  PiCircuitryBold, PiRulerBold, PiBrainBold, PiTreeStructureBold,
} from "react-icons/pi";
import {
  HiOutlineAcademicCap, HiOutlineBuildingLibrary,
  HiOutlineBeaker, HiOutlineCpuChip, HiOutlineSignal,
  HiOutlineBriefcase, HiOutlineBookOpen, HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { BsCircleFill, BsCircleHalf } from "react-icons/bs";
import { TbCircleOff } from "react-icons/tb";

/* ─── TYPES ───────────────────────────────── */
type Statut = "actif" | "bientot" | "passe";
type Page = "accueil" | "concours" | "matieres" | "sessions";
type SessTab = "encours" | "passees";

interface Concour {
  id: number;
  nom: string;
  ecole: string;
  Icon: IconType;
  statut: Statut;
  date: string;
  lieu: string;
  montant: string;
  duree: string;
  niveau: string;
  places: string;
  matieres: string[];
}

interface Matiere {
  Icon: IconType;
  nom: string;
  desc: string;
  concours: string[];
  coeff: string;
}

interface SessionData {
  month: string;
  day: string;
  name: string;
  lieu: string;
  eleves: string;
  matieres: string;
  duree: string;
  week?: string;
  taux?: string;
}

/* ─── DONNÉES ─────────────────────────────── */
const concours: Concour[] = [
  { id:1, nom:"ENSPD", ecole:"École Nationale Supérieure Polytechnique de Douala", Icon:HiOutlineBuildingLibrary, statut:"actif", date:"15 Juillet 2026", lieu:"Douala, Campus ENSPD", montant:"15 000 FCFA", duree:"8 semaines", niveau:"Bac/Bac+1", places:"200", matieres:["Mathématiques","Physique","Chimie","Informatique","Français"] },
  { id:2, nom:"IUT Douala", ecole:"Institut Universitaire de Technologie de Douala", Icon:HiOutlineAcademicCap, statut:"actif", date:"20 Juillet 2026", lieu:"Douala, IUT", montant:"10 000 FCFA", duree:"6 semaines", niveau:"Bac", places:"350", matieres:["Mathématiques","Physique","Français","Logique"] },
  { id:3, nom:"Médecine Douala", ecole:"Faculté de Médecine et des Sciences Pharmaceutiques", Icon:HiOutlineBeaker, statut:"actif", date:"10 Août 2026", lieu:"Douala, Faculté de Médecine", montant:"20 000 FCFA", duree:"10 semaines", niveau:"Bac C/D", places:"100", matieres:["Biologie","Chimie","Physique","Mathématiques"] },
  { id:4, nom:"ENSET Douala", ecole:"École Normale Supérieure de l'Enseignement Technique", Icon:MdOutlineElectricBolt, statut:"bientot", date:"05 Septembre 2026", lieu:"Douala, ENSET", montant:"12 000 FCFA", duree:"8 semaines", niveau:"Bac/Bac+1", places:"150", matieres:["Mathématiques","Physique","Sciences Industrielles","Français"] },
  { id:5, nom:"IAI", ecole:"Institut Africain d'Informatique", Icon:HiOutlineCpuChip, statut:"bientot", date:"12 Août 2026", lieu:"Libreville (en ligne possible)", montant:"8 000 FCFA", duree:"6 semaines", niveau:"Bac", places:"80", matieres:["Mathématiques","Logique","Informatique","Anglais"] },
  { id:6, nom:"ENSPT", ecole:"École Nationale Supérieure des Postes et Télécoms", Icon:HiOutlineSignal, statut:"actif", date:"25 Juillet 2026", lieu:"Yaoundé, ENSPT", montant:"10 000 FCFA", duree:"6 semaines", niveau:"Bac+2", places:"60", matieres:["Mathématiques","Physique","Électronique","Informatique"] },
  { id:7, nom:"EENSTP", ecole:"École des Travaux Publics", Icon:HiOutlineWrenchScrewdriver, statut:"bientot", date:"15 Août 2026", lieu:"Yaoundé", montant:"10 000 FCFA", duree:"7 semaines", niveau:"Bac C/D", places:"120", matieres:["Mathématiques","Physique","Dessin Technique"] },
  { id:8, nom:"ESSEC Douala", ecole:"École Supérieure des Sciences Économiques et Commerciales", Icon:HiOutlineBriefcase, statut:"passe", date:"10 Avril 2026", lieu:"Douala, ESSEC", montant:"15 000 FCFA", duree:"6 semaines", niveau:"Bac/Bac+1", places:"100", matieres:["Mathématiques","Économie","Français","Anglais","Culture Générale"] },
  { id:9, nom:"ENS", ecole:"École Normale Supérieure", Icon:HiOutlineBookOpen, statut:"passe", date:"20 Mars 2026", lieu:"Yaoundé, ENS", montant:"8 000 FCFA", duree:"5 semaines", niveau:"Bac", places:"200", matieres:["Français","Histoire-Géo","Philosophie","Mathématiques"] },
];

const matieres: Matiere[] = [
  { Icon:PiMathOperationsBold, nom:"Mathématiques", desc:"Algèbre, analyse, probabilités, géométrie. Matière fondamentale exigée par presque tous les concours.", concours:["ENSPD","IUT","Médecine","ENSET","IAI","ENSPT"], coeff:"5" },
  { Icon:PiAtomBold, nom:"Physique", desc:"Mécanique, électricité, optique, thermodynamique. Exigée dans les filières scientifiques et techniques.", concours:["ENSPD","IUT","Médecine","ENSET","ENSPT"], coeff:"4" },
  { Icon:PiFlaskBold, nom:"Chimie", desc:"Chimie générale, organique et minérale. Indispensable pour médecine et polytechnique.", concours:["ENSPD","Médecine","EENSTP"], coeff:"3" },
  { Icon:PiDnaBold, nom:"Biologie", desc:"Biologie cellulaire, génétique, physiologie humaine. Spécifique au concours de médecine.", concours:["Médecine"], coeff:"5" },
  { Icon:PiCodeBold, nom:"Informatique", desc:"Algorithmique, programmation, bases de données. Pour les concours à dominante numérique.", concours:["ENSPD","IUT","IAI","ENSPT"], coeff:"3" },
  { Icon:PiPencilBold, nom:"Français", desc:"Expression écrite, grammaire, résumé, dissertation. Obligatoire dans tous les concours.", concours:["Tous les concours"], coeff:"2" },
  { Icon:PiGlobeBold, nom:"Anglais", desc:"Compréhension écrite, expression. Exigé dans les concours internationaux et certaines grandes écoles.", concours:["IAI","ESSEC"], coeff:"2" },
  { Icon:PiChartBarBold, nom:"Économie", desc:"Micro et macroéconomie, marchés, comptabilité. Spécifique aux concours de gestion et commerce.", concours:["ESSEC"], coeff:"4" },
  { Icon:PiCircuitryBold, nom:"Électronique", desc:"Circuits, signaux, systèmes électroniques. Pour les filières télécommunications et génie électrique.", concours:["ENSPT","ENSET"], coeff:"3" },
  { Icon:PiRulerBold, nom:"Dessin Technique", desc:"Lecture de plans, cotation, coupes. Exigé dans les concours de génie civil et travaux publics.", concours:["EENSTP"], coeff:"3" },
  { Icon:PiBrainBold, nom:"Culture Générale", desc:"Histoire, géographie, actualité, logique. Présente dans beaucoup d'épreuves écrites.", concours:["ENS","ESSEC"], coeff:"2" },
  { Icon:PiTreeStructureBold, nom:"Logique & Raisonnement", desc:"Tests psychotechniques, suites logiques, raisonnement abstrait. Pour les concours IUT et IAI.", concours:["IUT","IAI"], coeff:"2" },
];

/* ─── STATUS PILL ─────────────────────────── */
const StatusPill: FC<{ statut: Statut }> = ({ statut }) => {
  if (statut === "actif") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#d4f0df] text-[#0f4f27]">
      <BsCircleFill className="text-[#22a052] text-[7px]" /> Actif
    </span>
  );
  if (statut === "bientot") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-100 text-amber-800">
      <BsCircleHalf className="text-amber-500 text-[8px]" /> Bientôt
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-gray-100 text-gray-500">
      <TbCircleOff className="text-[9px]" /> Passé
    </span>
  );
};

/* ─── MODAL ───────────────────────────────── */
interface ModalProps {
  concour: Concour | null;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ concour, onClose }) => {
  if (!concour) return null;
  const isPasse = concour.statut === "passe";

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto animate-[slideUp_.3s_ease]">
        <div className="bg-[#0a0a0a] rounded-t-2xl px-7 py-6 flex justify-between items-start">
          <div>
            <div className="font-['Clash_Display',sans-serif] text-[22px] font-bold text-white">{concour.nom}</div>
            <div className="text-[#888] text-[13px] mt-1">{concour.ecole}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors flex-shrink-0"
          >
            <FiX size={16} />
          </button>
        </div>
        <div className="p-7">
          <div className="mb-5"><StatusPill statut={concour.statut} /></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(
              [
                { Icon: FiCalendar, label: "Date du concours", val: concour.date, green: false },
                { Icon: FiMapPin,   label: "Lieu",             val: concour.lieu, green: false },
                { Icon: FiDollarSign, label: "Frais de dossier", val: concour.montant, green: true },
                { Icon: FiClock,   label: "Durée de prépa",   val: concour.duree, green: false },
                { Icon: FiAward,   label: "Niveau requis",    val: concour.niveau, green: false },
                { Icon: FiUsers,   label: "Places disponibles", val: `${concour.places} places`, green: false },
              ] as { Icon: IconType; label: string; val: string; green: boolean }[]
            ).map(({ Icon, label, val, green }) => (
              <div key={label} className="bg-[#f5f7f5] rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-semibold uppercase tracking-[0.4px] mb-1">
                  <Icon size={12} /> {label}
                </div>
                <div className={`text-[15px] font-bold ${green ? "text-[#1a7c3e]" : "text-[#0a0a0a]"}`}>{val}</div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-[13px] font-bold mb-3 text-[#0a0a0a]">Matières au programme</h4>
            <div className="flex flex-wrap gap-2">
              {concour.matieres.map((m) => (
                <span key={m} className="bg-[#d4f0df] text-[#0f4f27] px-3 py-1.5 rounded-full text-xs font-semibold">{m}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 mt-6">
            <button
              disabled={isPasse}
              className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                isPasse ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#1a7c3e] text-white hover:bg-[#0f4f27]"
              }`}
            >
              {isPasse ? "Session terminée" : "S'inscrire à ce concours"}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 bg-transparent border border-[#e0e0e0] rounded-xl text-[14px] font-semibold text-[#666] hover:border-[#999] transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── PAGE HEADER ─────────────────────────── */
interface PageHeaderProps {
  title: string;
  sub?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, sub }) => (
  <div className="bg-[#0a0a0a] px-10 md:px-20 py-10">
    <h1 className="font-clash text-[36px] font-bold text-white">{title}</h1>
    {sub && <p className="text-[#888] text-sm mt-1.5">{sub}</p>}
  </div>
);

/* ─── FOOTER ──────────────────────────────── */
interface FooterProps {
  compact?: boolean;
}

const Footer: FC<FooterProps> = ({ compact = false }) => (
  <footer className="bg-[#0a0a0a] px-10 md:px-20 py-9 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#1a1a1a]">
    <div>
      <div className="font-clash text-[18px] font-bold">
        <span className="text-[#1a7c3e]">Lu</span>
        <span className="text-[#1a7c3e]">X</span>
        <span className="text-white">PREPA</span>
      </div>
      {!compact && (
        <p className="mt-2 text-[#555] text-[13px]">Groupe de préparation aux concours — Douala, Cameroun</p>
      )}
    </div>
    <div className="text-right text-[13px] text-[#555] leading-7">
      {!compact && (
        <div className="flex items-center justify-end gap-1.5">
          <FiMapPin size={12} className="text-[#1a7c3e]" />
          École Primaire Mgr Albert Ndogmo, entrée IUT Douala
        </div>
      )}
      <div className="flex items-center justify-end gap-1.5">
        <FiPhone size={12} className="text-[#1a7c3e]" />
        {compact ? "+237 694 57 50 94" : "+237 694 57 50 94 / 695 52 33 13 / 679 59 61 98"}
      </div>
      {!compact && (
        <div className="mt-1 text-[#3a3a3a]">
          Début des cours : <strong className="text-[#1a7c3e]">Lundi 11 Mai 2026</strong>
        </div>
      )}
    </div>
  </footer>
);

/* ─── SESSION CARD ────────────────────────── */
interface SessionCardProps {
  session: SessionData;
  type: "encours" | "passees";
}

const SessionCard: FC<SessionCardProps> = ({ session, type }) => {
  const isEncours = type === "encours";
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl px-6 py-5 grid grid-cols-[auto_1fr_auto] items-center gap-5 hover:border-[#1a7c3e] hover:shadow-[0_4px_16px_rgba(26,124,62,0.08)] transition-all">
      <div className={`rounded-xl px-4 py-3 text-center min-w-[64px] ${isEncours ? "bg-[#1a7c3e]" : "bg-[#f3f4f6]"}`}>
        <div className={`text-[11px] font-semibold uppercase tracking-[0.5px] opacity-85 ${isEncours ? "text-white" : "text-[#888]"}`}>
          {session.month}
        </div>
        <div className={`font-clash text-[26px] font-bold leading-none ${isEncours ? "text-white" : "text-[#555]"}`}>
          {session.day}
        </div>
      </div>
      <div>
        <div className="font-clash text-[16px] font-bold mb-1.5">{session.name}</div>
        <div className="flex flex-wrap gap-4">
          {[
            { Icon: FiMapPin, val: session.lieu },
            { Icon: FiUsers, val: session.eleves },
            { Icon: FiBook, val: session.matieres },
            { Icon: FiClock, val: session.duree },
          ].map(({ Icon, val }) => (
            <span key={val} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
              <Icon size={11} className="text-[#1a7c3e]" /> {val}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right">
        {isEncours ? (
          <>
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#d4f0df] text-[#0f4f27] mb-2">En cours</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a]">
              Semaine <span className="text-[#1a7c3e]">{session.week}</span>
            </div>
          </>
        ) : (
          <>
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#f3f4f6] text-[#888] mb-2">Terminée</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a]">
              Taux réussite <span className="text-[#1a7c3e]">{session.taux}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ──────────────────────── */
const Home: FC = () => {
  const [page, setPage] = useState<Page>("accueil");
  const [filtre, setFiltre] = useState<"tous" | Statut>("tous");
  const [modalConcour, setModalConcour] = useState<Concour | null>(null);
  const [sessTab, setSessTab] = useState<SessTab>("encours");

  const filteredConcours: Concour[] =
    filtre === "tous" ? concours : concours.filter((c) => c.statut === filtre);

  const sessionsEncours: SessionData[] = [
    { month:"MAI", day:"11", name:"Session Intensive — Mai 2026",       lieu:"Entrée IUT Douala", eleves:"124 élèves inscrits", matieres:"Maths · Physique · Informatique", duree:"6 semaines",  week:"2/6"  },
    { month:"AVR", day:"28", name:"Prépa ENSPD — Spéciale Ingénierie",  lieu:"Entrée IUT Douala", eleves:"34 élèves",           matieres:"Maths · Physique · Chimie",        duree:"8 semaines",  week:"4/8"  },
    { month:"MAI", day:"05", name:"Prépa Médecine — PCEM1",             lieu:"Entrée IUT Douala", eleves:"19 élèves",           matieres:"Biologie · Chimie · Physique",     duree:"10 semaines", week:"2/10" },
  ];

  const sessionsPassees: SessionData[] = [
    { month:"JAN", day:"08", name:"Session Janvier 2026",       lieu:"Entrée IUT Douala", eleves:"98 élèves",  matieres:"Toutes matières",           duree:"4 semaines", taux:"72%" },
    { month:"OCT", day:"14", name:"Session Octobre 2025",       lieu:"Entrée IUT Douala", eleves:"112 élèves", matieres:"Maths · Physique · Français",duree:"6 semaines", taux:"68%" },
    { month:"JUL", day:"01", name:"Grande Session Été 2025",    lieu:"Entrée IUT Douala", eleves:"156 élèves", matieres:"Toutes matières",           duree:"8 semaines", taux:"81%" },
    { month:"MAR", day:"10", name:"Session Mars 2025",          lieu:"Entrée IUT Douala", eleves:"87 élèves",  matieres:"Maths · Physique · Chimie", duree:"5 semaines", taux:"65%" },
  ];

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans',sans-serif] bg-white text-[#0a0a0a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .font-clash { font-family: 'Clash Display', sans-serif; }
      `}</style>

      <Modal concour={modalConcour} onClose={() => setModalConcour(null)} />

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] flex items-center justify-between px-12 h-16">
        <button onClick={() => setPage("accueil")} className="font-clash text-[22px] font-bold cursor-pointer">
          <span className="text-[#1a7c3e]">Lu</span>
          <span className="text-[#1a7c3e]">X</span>
          <span className="text-[#0a0a0a]">PREPA</span>
        </button>
        <ul className="hidden md:flex gap-1 list-none m-0 p-0">
          {(
            [
              { key: "accueil",   label: "Accueil"   },
              { key: "concours",  label: "Concours"  },
              { key: "matieres",  label: "Matières"  },
              { key: "sessions",  label: "Sessions"  },
            ] as { key: Page; label: string }[]
          ).map(({ key, label }) => (
            <li key={key}>
              <button
                onClick={() => setPage(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none bg-transparent ${
                  page === key
                    ? "bg-[#d4f0df] text-[#0f4f27] font-semibold"
                    : "text-[#666] hover:bg-[#f5f7f5] hover:text-[#0a0a0a]"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2.5">
          <button className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#1a7c3e] text-[#1a7c3e] bg-transparent hover:bg-[#d4f0df] transition-all cursor-pointer">
            Se connecter
          </button>
          <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1a7c3e] text-white hover:bg-[#0f4f27] transition-all cursor-pointer border-none">
            S'inscrire
          </button>
        </div>
      </nav>

      {/* ══ PAGE ACCUEIL ══ */}
      {page === "accueil" && (
        <div>
          <section className="bg-[#0a0a0a] min-h-[500px] grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20 py-16 relative overflow-hidden gap-10">
            <div
              className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(26,124,62,0.35) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[rgba(26,124,62,0.2)] border border-[rgba(26,124,62,0.4)] text-[#6ee09e] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
                <BsCircleFill className="text-[#22a052] text-[8px]" />
                8 ans d'excellence · Douala
              </div>
              <h1 className="font-clash text-[46px] md:text-[52px] font-bold text-white leading-[1.1] mb-5">
                Intégrez les<br />
                <span className="text-[#22a052]">grandes écoles</span><br />
                du Cameroun
              </h1>
              <p className="text-[#aaa] text-[15px] leading-7 mb-8 max-w-[420px]">
                LuXPrepa prépare les candidats aux concours d'entrée des meilleures institutions — suivi personnalisé, cours intensifs, anciens sujets corrigés.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setPage("concours")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold bg-[#1a7c3e] text-white hover:bg-[#22a052] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,124,62,0.4)] transition-all cursor-pointer border-none"
                >
                  Voir les concours <FiChevronRight />
                </button>
                <button
                  onClick={() => setPage("sessions")}
                  className="px-7 py-3.5 rounded-xl text-[15px] font-bold bg-transparent border border-[#444] text-[#ccc] hover:border-[#888] hover:text-white transition-all cursor-pointer"
                >
                  Nos sessions
                </button>
              </div>
            </div>
            <div className="relative z-10 hidden md:flex justify-center">
              <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
                {[
                  { num: "+500", lbl: "Candidats préparés cette année", full: true },
                  { num: "13",   lbl: "Grandes écoles couvertes",       full: false },
                  { num: "8",    lbl: "Années d'expérience",            full: false },
                ].map(({ num, lbl, full }) => (
                  <div
                    key={lbl}
                    className={`${full ? "col-span-2 bg-[rgba(26,124,62,0.15)] border-[rgba(26,124,62,0.3)]" : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"} border rounded-2xl p-6 hover:bg-[rgba(26,124,62,0.25)] hover:border-[rgba(26,124,62,0.4)] transition-all`}
                  >
                    <div className="font-clash text-[40px] font-bold text-[#22a052]">{num}</div>
                    <div className="text-[#aaa] text-[13px] mt-1">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="px-10 md:px-20 py-14">
            <h2 className="font-clash text-[28px] font-bold mb-1.5">
              Nos <span className="text-[#1a7c3e]">Services</span>
            </h2>
            <p className="text-[#666] text-sm mb-9">Un accompagnement complet de A à Z pour réussir vos concours</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(
                [
                  { Icon: FiTarget,   title: "Orientation académique", desc: "Analyse de votre profil et recommandation des concours les plus adaptés." },
                  { Icon: FiBook,     title: "Préparation intensive",   desc: "Cours quotidiens avec professeurs spécialisés par concours." },
                  { Icon: FiCalendar, title: "Calendrier des concours", desc: "Dates, lieux, dossiers requis — toutes les informations centralisées." },
                  { Icon: FiFileText, title: "Anciens sujets",         desc: "Accès aux bords et anciens sujets corrigés pour s'entraîner efficacement." },
                ] as { Icon: IconType; title: string; desc: string }[]
              ).map(({ Icon, title, desc }) => (
                <div key={title} className="bg-[#f5f7f5] rounded-2xl p-7 hover:bg-[#d4f0df] hover:-translate-y-1 transition-all group cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:bg-[#1a7c3e] transition-all">
                    <Icon size={20} className="text-[#1a7c3e] group-hover:text-white transition-colors" />
                  </div>
                  <div className="font-bold text-[14px] mb-1.5">{title}</div>
                  <div className="text-[#666] text-[13px] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#1a7c3e] px-10 md:px-20 py-14 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="font-clash text-[28px] text-white font-bold">Prêt à intégrer votre grande école ?</h2>
              <p className="text-white/75 text-sm mt-1.5">Les cours de la session 2026 ont démarré — inscrivez-vous dès maintenant</p>
            </div>
            <button
              onClick={() => setPage("concours")}
              className="px-7 py-3.5 bg-white text-[#1a7c3e] rounded-xl text-[15px] font-bold border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all whitespace-nowrap"
            >
              Voir les concours disponibles
            </button>
          </div>

          <Footer />
        </div>
      )}

      {/* ══ PAGE CONCOURS ══ */}
      {page === "concours" && (
        <div>
          <PageHeader title="Concours 2026" sub="Tous les concours pour lesquels LuXPrepa vous prépare — cliquez sur un concours pour voir les détails" />

          <div className="px-10 md:px-20 pt-6 pb-0 flex flex-wrap gap-2.5 border-b border-[#e0e0e0]">
            {(
              [
                { val: "tous",    label: "Tous",    Dot: null },
                { val: "actif",   label: "Actifs",  Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
                { val: "bientot", label: "Bientôt", Dot: () => <BsCircleHalf className="text-amber-500 text-[9px]" /> },
                { val: "passe",   label: "Passés",  Dot: () => <TbCircleOff className="text-gray-400 text-[10px]" /> },
              ] as { val: "tous" | Statut; label: string; Dot: FC | null }[]
            ).map(({ val, label, Dot }) => (
              <button
                key={val}
                onClick={() => setFiltre(val)}
                className={`mb-3 inline-flex items-center gap-1.5 px-[18px] py-2 rounded-full text-[13px] font-semibold border transition-all cursor-pointer ${
                  filtre === val
                    ? "bg-[#1a7c3e] text-white border-[#1a7c3e]"
                    : "bg-white text-[#666] border-[#e0e0e0] hover:border-[#1a7c3e] hover:text-[#1a7c3e]"
                }`}
              >
                {Dot && <Dot />} {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-10 md:px-20 py-8 pb-14">
            {filteredConcours.map((c) => (
              <div
                key={c.id}
                className="border border-[#e0e0e0] rounded-2xl overflow-hidden hover:border-[#1a7c3e] hover:shadow-[0_8px_30px_rgba(26,124,62,0.12)] hover:-translate-y-1 transition-all bg-white"
              >
                <div className="px-5 pt-5 pb-4 border-b border-[#e0e0e0]">
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="w-11 h-11 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-[#1a7c3e]">
                      <c.Icon size={22} />
                    </div>
                    <StatusPill statut={c.statut} />
                  </div>
                  <div className="font-clash text-[16px] font-bold mb-1">{c.nom}</div>
                  <div className="text-xs text-[#666] leading-snug">{c.ecole}</div>
                </div>
                <div className="px-5 py-4">
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {(
                      [
                        { Icon: FiCalendar,   label: "Date",         val: c.date },
                        { Icon: FiMapPin,     label: "Lieu",         val: c.lieu.split(",")[0] },
                        { Icon: FiDollarSign, label: "Frais",        val: c.montant },
                        { Icon: FiClock,      label: "Préparation",  val: c.duree },
                      ] as { Icon: IconType; label: string; val: string }[]
                    ).map(({ Icon, label, val }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon size={13} className="text-[#1a7c3e] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#aaa] font-semibold uppercase tracking-[0.4px]">{label}</div>
                          <div className="text-[13px] font-semibold text-[#0a0a0a]">{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setModalConcour(c)}
                    className="w-full py-2.5 rounded-lg text-[13px] font-bold border border-[#1a7c3e] text-[#1a7c3e] bg-transparent hover:bg-[#1a7c3e] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {c.statut === "passe" ? "Voir les détails" : "Détails & s'inscrire"}
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Footer compact />
        </div>
      )}

      {/* ══ PAGE MATIÈRES ══ */}
      {page === "matieres" && (
        <div>
          <PageHeader title="Matières enseignées" sub="Les disciplines couvertes dans nos programmes de préparation aux concours" />
          <div className="px-10 md:px-20 pt-7 pb-2">
            <p className="text-[#666] text-sm max-w-[600px]">
              LuXPrepa couvre l'ensemble des matières exigées par les grandes écoles camerounaises. Chaque matière est enseignée par un professeur spécialisé avec supports, exercices et anciens sujets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-10 md:px-20 py-6 pb-14">
            {matieres.map((m) => (
              <div key={m.nom} className="bg-white border border-[#e0e0e0] rounded-2xl p-6 hover:border-[#1a7c3e] hover:shadow-[0_6px_24px_rgba(26,124,62,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1a7c3e]" />
                <div className="absolute top-4 right-4 bg-[#d4f0df] text-[#0f4f27] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  Coeff {m.coeff}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-[#1a7c3e] mb-4 mt-1">
                  <m.Icon size={24} />
                </div>
                <div className="font-clash text-[17px] font-bold mb-1.5">{m.nom}</div>
                <div className="text-[#666] text-[13px] leading-relaxed mb-4">{m.desc}</div>
                <div className="flex flex-wrap gap-1.5">
                  {m.concours.map((c) => (
                    <span key={c} className="bg-[#f5f7f5] text-[#555] px-2.5 py-1 rounded-md text-[11px] font-semibold">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Footer compact />
        </div>
      )}

      {/* ══ PAGE SESSIONS ══ */}
      {page === "sessions" && (
        <div>
          <PageHeader title="Sessions de préparation" sub="Retrouvez toutes les sessions internes organisées par LuXPrepa" />
          <div className="flex px-10 md:px-20 pt-6 pb-0 border-b border-[#e0e0e0] gap-0">
            {(
              [
                { key: "encours", label: "En cours", Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
                { key: "passees", label: "Passées",  Dot: () => <FiFileText size={13} /> },
              ] as { key: SessTab; label: string; Dot: FC }[]
            ).map(({ key, label, Dot }) => (
              <button
                key={key}
                onClick={() => setSessTab(key)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${
                  sessTab === key
                    ? "text-[#1a7c3e] border-[#1a7c3e]"
                    : "text-[#666] border-transparent hover:text-[#1a7c3e]"
                }`}
              >
                <Dot /> {label}
              </button>
            ))}
          </div>

          <div className="px-10 md:px-20 py-8 pb-14 flex flex-col gap-4">
            {(sessTab === "encours" ? sessionsEncours : sessionsPassees).map((s) => (
              <SessionCard key={s.name} session={s} type={sessTab} />
            ))}
          </div>
          <Footer compact />
        </div>
      )}
    </div>
  );
};
export default Home;


