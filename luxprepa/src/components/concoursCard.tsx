// components/ConcoursCard.tsx
import type { FC } from "react";
import {
  FiCalendar, FiMapPin, FiDollarSign, FiClock, FiChevronRight,
} from "react-icons/fi";
import StatusPill from "./statusPill";
import type { Concours } from "../api";
type Statut = "actif" | "bientot" | "passe";
interface ConcoursCardProps {
  concour: Concours;
  statut: Statut;
  onDetails: (concour: Concours) => void;
}

const ConcoursCard: FC<ConcoursCardProps> = ({ concour, statut, onDetails }) => {
  // Formatage des dates
  const debut = concour.date_debut
    ? new Date(concour.date_debut).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })
    : "—";
  const fin = concour.date_fin
    ? new Date(concour.date_fin).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  // Montant
  const montant = concour.montant_prepa + concour.inscription_prepa
    ? `${(concour.montant_prepa + concour.inscription_prepa).toLocaleString()} FCFA`
    : "Gratuit";

  // Lieu (première partie avant la virgule)
  const lieu = "Non précisé";

  // Durée estimée (si tu as un champ duree, sinon on utilise la différence entre dates)
  // Calcul sécurisé de la durée en jours
const calculerDuree = (debut?: string, fin?: string): string => {
  try {
    if (!debut || !fin) return "Variable";
    const d = new Date(debut);
    const f = new Date(fin);
    // Vérifier que les dates sont valides
    if (isNaN(d.getTime()) || isNaN(f.getTime())) return "Variable";
    const diffMs = f.getTime() - d.getTime();
    const jours = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (jours <= 0) return "Variable";
    return `${jours} jours`;
  } catch {
    return "Variable";
  }
};

const duree = calculerDuree(concour.date_debut, concour.date_fin);

  return (
    <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden hover:border-[#1a7c3e] hover:shadow-[0_8px_30px_rgba(26,124,62,0.12)] hover:-translate-y-1 transition-all bg-white">
      {/* Entête */}
      <div className="px-5 pt-5 pb-4 border-b border-[#e0e0e0]">
        <div className="flex justify-between items-start mb-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-[#1a7c3e]">
            {/* Icône générique (tu peux la remplacer par une icône liée au concours si disponible) */}
            <FiCalendar size={22} />
          </div>
          <StatusPill statut={statut} />
        </div>
        <div className="font-clash text-[16px] font-bold mb-1">{concour.nom}</div>
        <div className="text-xs text-[#666] leading-snug">{concour.description}</div>
      </div>

      {/* Corps */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { Icon: FiCalendar, label: "Début", val: debut },
            { Icon: FiCalendar, label: "Fin", val: fin },
            { Icon: FiMapPin, label: "Lieu", val: lieu },
            { Icon: FiDollarSign, label: "Frais", val: montant, green: true },
            { Icon: FiClock, label: "Préparation", val: duree },
          ].map(({ Icon, label, val, green }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={13} className="text-[#1a7c3e] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-[#aaa] font-semibold uppercase tracking-[0.4px]">
                  {label}
                </div>
                <div
                  className={`text-[13px] font-semibold ${
                    green ? "text-[#1a7c3e]" : "text-[#0a0a0a]"
                  }`}
                >
                  {val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton détails */}
        <button
          onClick={() => onDetails(concour)}
          className="w-full py-2.5 rounded-lg text-[13px] font-bold border border-[#1a7c3e] text-[#1a7c3e] bg-transparent hover:bg-[#1a7c3e] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          {statut === "passe" ? "Voir les détails" : "Détails & s'inscrire"}
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ConcoursCard;
