import {type FC,type MouseEvent } from "react";
import {
  FiCalendar, FiDollarSign, FiX,
} from "react-icons/fi";
import StatusPill, {type Statut } from "./statusPill";
import type { Concours, Matiere } from "../api";

interface ModalProps {
  concour: Concours | null;
  statut: Statut;
  onClose: () => void;
  onInscrire?: (concourId: string) => void;
}

const ModalConcours: FC<ModalProps> = ({ concour, statut, onClose, onInscrire }) => {
  if (!concour) return null;
  const isPasse = statut === "passe";

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto animate-[slideUp_.3s_ease]">
        <div className="bg-[#0a0a0a] rounded-t-2xl px-7 py-6 flex justify-between items-start">
          <div>
            <div className="font-['Clash_Display',sans-serif] text-[22px] font-bold text-white">
              {concour.nom}
            </div>
            <div className="text-[#888] text-[13px] mt-1">{concour.description}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors flex-shrink-0"
          >
            <FiX size={16} />
          </button>
        </div>
        <div className="p-7">
          <div className="mb-5"><StatusPill statut={statut} /></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(
              [
                { Icon: FiCalendar, label: "Début", val: formatDate(concour.date_debut) },
                { Icon: FiCalendar, label: "Fin", val: formatDate(concour.date_fin) },
                { Icon: FiDollarSign, label: "Frais", val: `${(concour.montant_prepa + concour.inscription_prepa).toLocaleString()} FCFA`, green: true },
              ] as const
            ).map(({ Icon, label, val, green }) => (
              <div key={label} className="bg-[#f5f7f5] rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-semibold uppercase tracking-[0.4px] mb-1">
                  <Icon size={12} /> {label}
                </div>
                <div className={`text-[15px] font-bold ${green ? "text-[#1a7c3e]" : "text-[#0a0a0a]"}`}>
                  {val}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-[13px] font-bold mb-3 text-[#0a0a0a]">Matières au programme</h4>
            <div className="flex flex-wrap gap-2">
              {concour.matieres?.map((m: Matiere) => (
                <span
                  key={m.id}
                  className="bg-[#d4f0df] text-[#0f4f27] px-3 py-1.5 rounded-full text-xs font-semibold"
                >
                  {m.nom}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 mt-6">
            <button
              disabled={isPasse}
              onClick={() => { if (!isPasse && onInscrire) onInscrire(concour.id); }}
              className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                isPasse
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#1a7c3e] text-white hover:bg-[#0f4f27]"
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

export default ModalConcours;
