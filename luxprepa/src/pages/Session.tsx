import { useState, useEffect } from "react";
import { sessionApi, concoursApi } from "../api";
import type { Session, Concours } from "../api";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCalendar, FiMapPin, FiUsers, FiClock,
  FiBook, FiPlus, FiX, FiFileText,
} from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";

type SessTab = "encours" | "passees";

/* ─── HELPERS ─────────────────────────────── */
function isEncours(date: string): boolean {
  return new Date(date) >= new Date(new Date().setMonth(new Date().getMonth() - 2));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
    full: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
  };
}

/* ─── SESSION CARD ────────────────────────── */
const SessionCard = ({
  session,
  type,
}: {
  session: Session;
  type: SessTab;
}) => {
  const isActive = type === "encours";
  const { month, day } = formatDate(session.date ?? "");

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl px-6 py-5 grid grid-cols-[auto_1fr_auto] items-center gap-5 hover:border-[#1a7c3e] hover:shadow-[0_4px_16px_rgba(26,124,62,0.08)] transition-all">
      {/* Date */}
      <div className={`rounded-xl px-4 py-3 text-center min-w-[64px] ${isActive ? "bg-[#1a7c3e]" : "bg-[#f3f4f6]"}`}>
        <div className={`text-[11px] font-semibold uppercase tracking-[0.5px] opacity-85 ${isActive ? "text-white" : "text-[#888]"}`}>
          {month}
        </div>
        <div className={`font-clash text-[26px] font-bold leading-none ${isActive ? "text-white" : "text-[#555]"}`}>
          {day}
        </div>
      </div>

      {/* Infos */}
      <div>
        <div className="font-clash text-[16px] font-bold mb-1.5">{session.nom}</div>
        <div className="flex flex-wrap gap-4">
          {[
            { Icon: FiBook,     val: session.concours_nom ?? "—" },
            { Icon: FiCalendar, val: formatDate(session.date ?? "").full },
            { Icon: FiUsers,    val: `${session.nombre_notes ?? 0} notes` },
          ].map(({ Icon, val }) => (
            <span key={val} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
              <Icon size={11} className="text-[#1a7c3e]" /> {val}
            </span>
          ))}
        </div>
      </div>

      {/* Statut */}
      <div className="text-right">
        {isActive ? (
          <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#d4f0df] text-[#0f4f27]">
            En cours
          </div>
        ) : (
          <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#f3f4f6] text-[#888]">
            Terminée
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MODAL CRÉER SESSION ──────────────────── */
const ModalCreer = ({
  concours,
  onClose,
  onCreer,
  loading,
}: {
  concours: Concours[];
  onClose: () => void;
  onCreer: (data: { nom: string; date: string; concours_id: string }) => void;
  loading: boolean;
}) => {
  const [nom, setNom]               = useState("");
  const [date, setDate]             = useState("");
  const [concoursId, setConcoursId] = useState("");

  const handleSubmit = () => {
    if (!nom || !date || !concoursId) {
      toast.error("Tous les champs sont obligatoires.");
      return;
    }
    onCreer({ nom, date, concours_id: concoursId });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[460px]"
        style={{ animation: "slideUp .3s ease" }}
      >
        {/* Header */}
        <div className="bg-[#0a0a0a] rounded-t-2xl px-7 py-5 flex justify-between items-center">
          <div className="font-clash text-[18px] font-bold text-white">Nouvelle session</div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-4">
          {/* Nom */}
          <div>
            <label className="text-[12px] font-semibold text-[#aaa] uppercase tracking-[0.4px] mb-1.5 block">
              Nom de la session
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Session Intensive Mai 2026"
              className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#1a7c3e] transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[12px] font-semibold text-[#aaa] uppercase tracking-[0.4px] mb-1.5 block">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#1a7c3e] transition-colors"
            />
          </div>

          {/* Concours */}
          <div>
            <label className="text-[12px] font-semibold text-[#aaa] uppercase tracking-[0.4px] mb-1.5 block">
              Concours associé
            </label>
            <select
              value={concoursId}
              onChange={(e) => setConcoursId(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#1a7c3e] transition-colors bg-white"
            >
              <option value="">Sélectionner un concours</option>
              {concours.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-[14px] font-bold bg-[#1a7c3e] text-white hover:bg-[#0f4f27] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
            >
              {loading ? <ClipLoader color="#fff" size={18} /> : "Créer la session"}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-[14px] font-semibold border border-[#e0e0e0] text-[#666] hover:border-[#999] transition-all cursor-pointer bg-transparent"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── PAGE SESSIONS ────────────────────────── */
export default function SessionsPage() {
  const [sessions, setSessions]       = useState<Session[]>([]);
  const [concours, setConcours]       = useState<Concours[]>([]);
  const [loading, setLoading]         = useState(true);
  const [sessTab, setSessTab]         = useState<SessTab>("encours");
  const [showModal, setShowModal]     = useState(false);
  const [creerLoading, setCreerLoading] = useState(false);

  /* Chargement initial */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listeSessions, listeConcours] = await Promise.all([
          sessionApi.liste(),
          concoursApi.liste(),
        ]);
        setSessions(listeSessions);
        setConcours(listeConcours);
      } catch {
        toast.error("Impossible de charger les sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Créer une session */
  const handleCreer = async (data: { nom: string; date: string; concours_id: string }) => {
    setCreerLoading(true);
    try {
      const res = await sessionApi.creer(data);
      setSessions((prev) => [res.session, ...prev]);
      toast.success("Session créée avec succès !");
      setShowModal(false);
    } catch {
      toast.error("Erreur lors de la création.");
    } finally {
      setCreerLoading(false);
    }
  };

  /* Séparer sessions en cours / passées */
  const sessionsEncours = sessions.filter((s) => s.date && isEncours(s.date));
  const sessionsPassees  = sessions.filter((s) => s.date && !isEncours(s.date));
  const sessionsAffichees = sessTab === "encours" ? sessionsEncours : sessionsPassees;

  return (
    <div
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .font-clash { font-family: 'Clash Display', sans-serif; }
      `}</style>

      <Toaster position="top-right" />

      {showModal && (
        <ModalCreer
          concours={concours}
          onClose={() => setShowModal(false)}
          onCreer={handleCreer}
          loading={creerLoading}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0a0a0a] px-10 md:px-20 py-10 flex justify-between items-center">
        <div>
          <h1 className="font-clash text-[36px] font-bold text-white">Sessions de préparation</h1>
          <p className="text-[#888] text-sm mt-1.5">
            Retrouvez toutes les sessions internes organisées par LuXPrepa
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a7c3e] text-white rounded-xl text-sm font-bold hover:bg-[#0f4f27] transition-all cursor-pointer border-none"
        >
          <FiPlus size={16} /> Nouvelle session
        </button>
      </div>

      {/* ── ONGLETS ── */}
      <div className="flex px-10 md:px-20 pt-6 pb-0 border-b border-[#e0e0e0] gap-0">
        {([
          { key: "encours", label: "En cours", Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
          { key: "passees", label: "Passées",  Dot: () => <FiFileText size={13} /> },
        ] as { key: SessTab; label: string; Dot: () => React.ReactElement }[]).map(({ key, label, Dot }) => (
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
            <span className="ml-1 bg-[#f3f4f6] text-[#888] text-[11px] font-bold px-2 py-0.5 rounded-full">
              {key === "encours" ? sessionsEncours.length : sessionsPassees.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── LISTE SESSIONS ── */}
      <div className="px-10 md:px-20 py-8 pb-14 flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <ClipLoader color="#1a7c3e" size={44} />
          </div>
        ) : sessionsAffichees.length === 0 ? (
          <div className="text-center py-16 text-[#888]">
            <FiClock size={36} className="mx-auto mb-3 opacity-30" />
            <p>Aucune session {sessTab === "encours" ? "en cours" : "passée"} pour le moment.</p>
          </div>
        ) : (
          sessionsAffichees.map((s) => (
            <SessionCard key={s.id} session={s} type={sessTab} />
          ))
        )}
      </div>
    </div>
  );
}
