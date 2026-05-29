import type { FC } from "react";
import { FiMapPin, FiPhone } from "react-icons/fi";

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
        <p className="mt-2 text-[#555] text-[13px]">
          Groupe de préparation aux concours — Douala, Cameroun
        </p>
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
        {compact
          ? "+237 694 57 50 94"
          : "+237 694 57 50 94 / 695 52 33 13 / 679 59 61 98"}
      </div>
      {!compact && (
        <div className="mt-1 text-[#3a3a3a]">
          Début des cours :{" "}
          <strong className="text-[#1a7c3e]">Lundi 11 Mai 2026</strong>
        </div>
      )}
    </div>
  </footer>
);

export default Footer;
