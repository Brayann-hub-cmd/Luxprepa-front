import type { FC } from "react";
import { BsCircleFill, BsCircleHalf } from "react-icons/bs";
import { TbCircleOff } from "react-icons/tb";

type Statut = "actif" | "bientot" | "passe";

const StatusPill: FC<{ statut: Statut }> = ({ statut }) => {
  if (statut === "actif")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#d4f0df] text-[#0f4f27]">
        <BsCircleFill className="text-[#22a052] text-[7px]" /> Actif
      </span>
    );
  if (statut === "bientot")
    return (
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

export type { Statut };
export default StatusPill;
