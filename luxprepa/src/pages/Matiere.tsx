import { useState, useEffect } from "react";
import { matiereApi, matiereConcourApi } from "../api";
import type { Matiere, MatiereConcours } from "../api";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import {
  FiBook, FiSearch, FiChevronRight, FiX,
} from "react-icons/fi";
import { PiMathOperationsBold } from "react-icons/pi";

/* ─── MODAL DÉTAIL MATIÈRE ─────────────────── */
const Modal = ({
  matiere,
  concours,
  loadingConcours,
  onClose,
}: {
  matiere: Matiere | null;
  concours: MatiereConcours[];
  loadingConcours: boolean;
  onClose: () => void;
}) => {
  if (!matiere) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[500px] max-h-[85vh] overflow-y-auto"
        style={{ animation: "slideUp .3s ease" }}
      >
        {/* Header */}
        <div className="bg-[#0a0a0a] rounded-t-2xl px-7 py-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a7c3e]/20 flex items-center justify-center">
              <PiMathOperationsBold className="text-[#22a052] text-xl" />
            </div>
            <div>
              <div className="font-clash text-[20px] font-bold text-white">{matiere.nom}</div>
              <div className="text-[#888] text-[12px] mt-0.5">Matière</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:text-white transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="p-7">
          {/* Description */}
          {matiere.description && (
            <div className="bg-[#f5f7f5] rounded-xl p-4 mb-6">
              <div className="text-[11px] text-[#aaa] font-semibold uppercase tracking-[0.4px] mb-1">Description</div>
              <p className="text-[14px] text-[#0a0a0a] leading-relaxed">{matiere.description}</p>
            </div>
          )}

          {/* Concours associés */}
          <div>
            <h4 className="text-[13px] font-bold mb-3 text-[#0a0a0a]">
              Concours utilisant cette matière
            </h4>
            {loadingConcours ? (
              <div className="flex justify-center py-6">
                <ClipLoader color="#1a7c3e" size={28} />
              </div>
            ) : concours.length === 0 ? (
              <p className="text-[#888] text-sm">Aucun concours associé.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {concours.map((mc) => (
                  <div
                    key={mc.id}
                    className="flex items-center justify-between bg-[#f5f7f5] rounded-xl px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold text-[14px] text-[#0a0a0a]">{mc.concours_nom}</div>
                      <div className="text-[12px] text-[#888]">Matière : {mc.matiere_nom}</div>
                    </div>
                    <div className="bg-[#d4f0df] text-[#0f4f27] text-[12px] font-bold px-3 py-1 rounded-full">
                      Coeff {mc.coefficient}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl text-[14px] font-semibold border border-[#e0e0e0] text-[#666] hover:border-[#999] transition-all cursor-pointer bg-transparent"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── PAGE MATIÈRES ────────────────────────── */
export default function MatieresPage() {
  const [matieres, setMatieres]               = useState<Matiere[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [selected, setSelected]               = useState<Matiere | null>(null);
  const [concoursDuModal, setConcoursDuModal] = useState<MatiereConcours[]>([]);
  const [loadingConcours, setLoadingConcours] = useState(false);

  /* Chargement initial */
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const liste = await matiereApi.liste();
        setMatieres(liste);
      } catch {
        toast.error("Impossible de charger les matières.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatieres();
  }, []);

  /* Ouvrir le modal + charger les concours liés */
  const handleOuvrir = async (matiere: Matiere) => {
    setSelected(matiere);
    setLoadingConcours(true);
    setConcoursDuModal([]);
    try {
      const tous = await matiereConcourApi.liste();
      const lies = tous.filter((mc) => String(mc.matiere_nom) === matiere.nom);
      setConcoursDuModal(lies);
    } catch {
      toast.error("Impossible de charger les concours.");
    } finally {
      setLoadingConcours(false);
    }
  };

  const fermerModal = () => {
    setSelected(null);
    setConcoursDuModal([]);
  };

  /* Filtrage par recherche */
  const matieresFiltrees = matieres.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    (m.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

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

      <Modal
        matiere={selected}
        concours={concoursDuModal}
        loadingConcours={loadingConcours}
        onClose={fermerModal}
      />

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0a0a0a] px-10 md:px-20 py-10">
        <h1 className="font-clash text-[36px] font-bold text-white">Matières enseignées</h1>
        <p className="text-[#888] text-sm mt-1.5">
          Les disciplines couvertes dans nos programmes de préparation aux concours
        </p>
      </div>

      {/* ── INTRO + RECHERCHE ── */}
      <div className="px-10 md:px-20 pt-8 pb-4">
        <p className="text-[#666] text-sm max-w-[600px] mb-6">
          LuXPrepa couvre l'ensemble des matières exigées par les grandes écoles camerounaises.
          Chaque matière est enseignée par un professeur spécialisé avec supports, exercices et anciens sujets.
        </p>

        {/* Barre de recherche */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-[#1a7c3e] transition-colors"
          />
        </div>
      </div>

      {/* ── GRILLE MATIÈRES ── */}
      <div className="px-10 md:px-20 py-6 pb-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <ClipLoader color="#1a7c3e" size={44} />
          </div>
        ) : matieresFiltrees.length === 0 ? (
          <div className="text-center py-16 text-[#888]">
            <FiBook size={36} className="mx-auto mb-3 opacity-30" />
            <p>Aucune matière trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matieresFiltrees.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-[#e0e0e0] rounded-2xl p-6 hover:border-[#1a7c3e] hover:shadow-[0_6px_24px_rgba(26,124,62,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden cursor-default"
              >
                {/* Barre verte en haut */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1a7c3e]" />

                {/* Icône */}
                <div className="w-12 h-12 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-[#1a7c3e] mb-4 mt-1">
                  <PiMathOperationsBold size={24} />
                </div>

                {/* Nom */}
                <div className="font-clash text-[17px] font-bold mb-1.5">{m.nom}</div>

                {/* Description */}
                {m.description ? (
                  <p className="text-[#666] text-[13px] leading-relaxed mb-4 line-clamp-3">
                    {m.description}
                  </p>
                ) : (
                  <p className="text-[#aaa] text-[13px] italic mb-4">Aucune description.</p>
                )}

                {/* Bouton voir détail */}
                <button
                  onClick={() => handleOuvrir(m)}
                  className="inline-flex items-center gap-1.5 text-[#1a7c3e] text-[13px] font-semibold hover:gap-3 transition-all cursor-pointer bg-transparent border-none p-0"
                >
                  Voir les concours <FiChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
