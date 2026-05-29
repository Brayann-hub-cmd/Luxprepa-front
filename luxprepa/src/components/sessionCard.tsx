import type { FC } from "react";
import { FiMapPin, FiUsers, FiBook, FiClock } from "react-icons/fi";
import type { Session } from "../api";

type SessTab = "encours" | "passees";

interface SessionCardProps {
  session: Session;
  type: SessTab;
}

const SessionCard: FC<SessionCardProps> = ({ session, type }) => {
  const isEncours = type === "encours";

  // Extraire le mois et le jour depuis session.date (format string)
  let month = "—";
  let day = "—";
  if (session.date) {
    const d = new Date(session.date);
    month = d.toLocaleString("fr-FR", { month: "short" }).toUpperCase();
    day = d.getDate().toString();
  }

  const nomConcours = session.concours_nom ?? session.concours?.nom ?? "Concours inconnu";
  const nbNotes = session.nombre_notes ?? 0;

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl px-6 py-5 grid grid-cols-[auto_1fr_auto] items-center gap-5 hover:border-[#1a7c3e] hover:shadow-[0_4px_16px_rgba(26,124,62,0.08)] transition-all">
      <div className={`rounded-xl px-4 py-3 text-center min-w-[64px] ${isEncours ? "bg-[#1a7c3e]" : "bg-[#f3f4f6]"}`}>
        <div className={`text-[11px] font-semibold uppercase tracking-[0.5px] ${isEncours ? "text-white" : "text-[#888]"}`}>
          {month}
        </div>
        <div className={`font-clash text-[26px] font-bold leading-none ${isEncours ? "text-white" : "text-[#555]"}`}>
          {day}
        </div>
      </div>
      <div>
        <div className="font-clash text-[16px] font-bold mb-1.5">{session.nom}</div>
        <div className="flex flex-wrap gap-4">
          {[
            { Icon: FiMapPin, val: nomConcours }, // on utilise le nom du concours comme "lieu"
            { Icon: FiUsers, val: `${nbNotes} notes` },
            { Icon: FiBook, val: session.concours?.matieres?.length ? `${session.concours.matieres.length} matières` : "Plusieurs matières" },
            { Icon: FiClock, val: "1 jour" }, // aucune donnée de durée dans l'interface, on met un placeholder
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
              Semaine <span className="text-[#1a7c3e]">?</span>
            </div>
          </>
        ) : (
          <>
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#f3f4f6] text-[#888] mb-2">Terminée</div>
            <div className="text-[13px] font-semibold text-[#0a0a0a]">
              Taux réussite <span className="text-[#1a7c3e]">—</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;