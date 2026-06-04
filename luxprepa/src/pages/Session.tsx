import { useState, useEffect } from "react";
import { sessionApi } from "../api";
import type { Session } from "../api";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCalendar, FiUsers, FiClock,
  FiBook, FiFileText,
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
            { Icon: FiBook, val: session.concours_nom ?? "—" },
            { Icon: FiCalendar, val: formatDate(session.date ?? "").full },
            { Icon: FiUsers, val: `${session.nombre_notes ?? 0} notes` },
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

/* ─── PAGE SESSIONS ────────────────────────── */
export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessTab, setSessTab] = useState<SessTab>("encours");

  /* Chargement initial */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listeSessions] = await Promise.all([
          sessionApi.liste(),
        ]);
        setSessions(listeSessions);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Séparer sessions en cours / passées */
  const sessionsEncours = sessions.filter((s) => s.date && isEncours(s.date));
  const sessionsPassees = sessions.filter((s) => s.date && !isEncours(s.date));
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

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0a0a0a] px-10 md:px-20 py-10 flex justify-between items-center">
        <div>
          <h1 className="font-clash text-[36px] font-bold text-white">Sessions de préparation</h1>
          <p className="text-[#888] text-sm mt-1.5">
            Retrouvez toutes les sessions internes organisées par LuXPrepa
          </p>
        </div>
      </div>

      {/* ── ONGLETS ── */}
      <div className="flex px-10 md:px-20 pt-6 pb-0 border-b border-[#e0e0e0] gap-0">
        {([
          { key: "encours", label: "En cours", Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
          { key: "passees", label: "Passées", Dot: () => <FiFileText size={13} /> },
        ] as { key: SessTab; label: string; Dot: () => React.ReactElement }[]).map(({ key, label, Dot }) => (
          <button
            key={key}
            onClick={() => setSessTab(key)}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${sessTab === key
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
