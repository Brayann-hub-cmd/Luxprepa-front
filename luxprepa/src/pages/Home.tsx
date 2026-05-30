import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTarget, FiBook, FiCalendar, FiFileText, FiChevronRight,
  FiMapPin, FiPhone, FiUsers, FiClock, FiDollarSign, FiAward, FiX,
} from "react-icons/fi";
import { BsCircleFill, BsCircleHalf } from "react-icons/bs";
import { TbCircleOff } from "react-icons/tb";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";

import {
  concoursApi,
  matiereApi,
  inscriptionApi,
} from "../api";
import type { Concours, Matiere } from "../api";

/* ─── HELPERS ─────────────────────────────── */
type Statut = "actif" | "bientot" | "en_cours" | "passe";

function getStatut(date_debut: string, date_fin: string): Statut {
  const now = new Date();
  const debut = new Date(date_debut);
  const fin = new Date(date_fin);
  const diffJours = (debut.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (now > fin) return "passe";
  if (now >= debut) return "en_cours";
  if (diffJours <= 7) return "bientot";
  return "actif";
}

/* ─── STATUS PILL ─────────────────────────── */
const StatusPill = ({ statut }: { statut: Statut }) => {
  if (statut === "actif" || statut === "en_cours")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#d4f0df] text-[#0f4f27]">
        <BsCircleFill className="text-[#22a052] text-[7px]" />
        {statut === "en_cours" ? "En cours" : "Actif"}
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

/* ─── MODAL DÉTAIL CONCOURS ──────────────── */
const Modal = ({
  concour,
  onClose,
  onInscrire,
  inscriptionLoading,
  inscritIds,
}: {
  concour: Concours | null;
  onClose: () => void;
  onInscrire: (id: string) => void;
  inscriptionLoading: string | null;
  inscritIds: string[];
}) => {
  if (!concour) return null;
  const statut = getStatut(concour.date_debut, concour.date_fin);
  const isPasse = statut === "passe";
  const dejaInscrit = inscritIds.includes(concour.id);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto"
        style={{ animation: "slideUp .3s ease" }}>
        {/* Header modal */}
        <div className="bg-[#0a0a0a] rounded-t-2xl px-7 py-6 flex justify-between items-start">
          <div>
            <div className="font-clash text-[22px] font-bold text-white">{concour.nom}</div>
            {concour.description && (
              <div className="text-[#888] text-[13px] mt-1 max-w-[380px] line-clamp-2">{concour.description}</div>
            )}
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

          {/* Infos grille */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { Icon: FiCalendar,   label: "Date début",        val: new Date(concour.date_debut).toLocaleDateString("fr-FR"), green: false },
              { Icon: FiCalendar,   label: "Date fin",          val: new Date(concour.date_fin).toLocaleDateString("fr-FR"),   green: false },
              { Icon: FiDollarSign, label: "Frais inscription", val: `${concour.inscription_prepa} €`,                        green: true  },
              { Icon: FiDollarSign, label: "Frais formation",   val: `${concour.montant_prepa} €`,                            green: false },
              { Icon: FiUsers,      label: "Inscrits",          val: concour.nombre_inscrits !== undefined ? String(concour.nombre_inscrits) : "—", green: false },
              { Icon: FiAward,      label: "Matières",          val: concour.nombre_matieres !== undefined ? String(concour.nombre_matieres) : "—", green: false },
            ].map(({ Icon, label, val, green }) => (
              <div key={label} className="bg-[#f5f7f5] rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-semibold uppercase tracking-[0.4px] mb-1">
                  <Icon size={12} /> {label}
                </div>
                <div className={`text-[15px] font-bold ${green ? "text-[#1a7c3e]" : "text-[#0a0a0a]"}`}>{val}</div>
              </div>
            ))}
          </div>

          {/* Matières au programme */}
          {concour.matieres && concour.matieres.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[13px] font-bold mb-3 text-[#0a0a0a]">Matières au programme</h4>
              <div className="flex flex-wrap gap-2">
                {concour.matieres.map((m) => (
                  <span key={m.id} className="bg-[#d4f0df] text-[#0f4f27] px-3 py-1.5 rounded-full text-xs font-semibold">
                    {m.matiere_nom} — coeff. {m.coefficient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-2.5 mt-6">
            {dejaInscrit ? (
              <div className="flex-1 py-3.5 rounded-xl text-[14px] font-bold bg-[#d4f0df] text-[#0f4f27] text-center">
                ✅ Vous êtes inscrit !
              </div>
            ) : (
              <button
                disabled={isPasse || inscriptionLoading === concour.id}
                onClick={() => onInscrire(concour.id)}
                className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
                  isPasse
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#1a7c3e] text-white hover:bg-[#0f4f27] cursor-pointer"
                }`}
              >
                {inscriptionLoading === concour.id ? (
                  <ClipLoader color="#fff" size={18} />
                ) : isPasse ? (
                  "Session terminée"
                ) : (
                  "S'inscrire à ce concours"
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-3.5 bg-transparent border border-[#e0e0e0] rounded-xl text-[14px] font-semibold text-[#666] hover:border-[#999] transition-all cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── FOOTER ──────────────────────────────── */
const Footer = ({ compact = false }: { compact?: boolean }) => (
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

/* ─── HOME PAGE ───────────────────────────── */
export default function Home() {
  const navigate = useNavigate();

  const [concours, setConcours]                 = useState<Concours[]>([]);
  const [matieres, setMatieres]                 = useState<Matiere[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [modalConcour, setModalConcour]         = useState<Concours | null>(null);
  const [inscriptionLoading, setInscriptionLoading] = useState<string | null>(null);
  const [inscritIds, setInscritIds]             = useState<string[]>([]);

  // Charger concours + matières au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listeConcours, listeMatieres] = await Promise.all([
          concoursApi.liste(),
          matiereApi.liste(),
        ]);
        setConcours(listeConcours);
        setMatieres(listeMatieres);
      } catch {
        toast.error("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // S'inscrire à un concours (seul POST)
  const handleInscrire = async (concoursId: string) => {
    setInscriptionLoading(concoursId);
    try {
      await inscriptionApi.inscrire(concoursId);
      setInscritIds((prev) => [...prev, concoursId]);
      toast.success("Inscription confirmée !");
      setModalConcour(null);
    } catch {
      toast.error("Erreur lors de l'inscription.");
    } finally {
      setInscriptionLoading(null);
    }
  };

  // 3 concours actifs à afficher sur la home
  const concoursActifs = concours
    .filter((c) => getStatut(c.date_debut, c.date_fin) !== "passe")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .font-clash { font-family: 'Clash Display', sans-serif; }
      `}</style>

      <Toaster position="top-right" />

      <Modal
        concour={modalConcour}
        onClose={() => setModalConcour(null)}
        onInscrire={handleInscrire}
        inscriptionLoading={inscriptionLoading}
        inscritIds={inscritIds}
      />

      {/* ── HERO ── */}
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
              onClick={() => navigate("/concours")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold bg-[#1a7c3e] text-white hover:bg-[#22a052] hover:-translate-y-0.5 transition-all cursor-pointer border-none"
            >
              Voir les concours <FiChevronRight />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-7 py-3.5 rounded-xl text-[15px] font-bold bg-transparent border border-[#444] text-[#ccc] hover:border-[#888] hover:text-white transition-all cursor-pointer"
            >
              S'inscrire
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 hidden md:flex justify-center">
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
            {[
              { num: `+${concours.length > 0 ? concours.reduce((a, c) => a + (c.nombre_inscrits ?? 0), 0) : 500}`, lbl: "Candidats inscrits cette année", full: true },
              { num: String(concours.length > 0 ? concours.length : 13), lbl: "Concours disponibles", full: false },
              { num: String(matieres.length > 0 ? matieres.length : 12), lbl: "Matières couvertes",   full: false },
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

      {/* ── SERVICES ── */}
      <section className="px-10 md:px-20 py-14">
        <h2 className="font-clash text-[28px] font-bold mb-1.5">
          Nos <span className="text-[#1a7c3e]">Services</span>
        </h2>
        <p className="text-[#666] text-sm mb-9">Un accompagnement complet de A à Z pour réussir vos concours</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { Icon: FiTarget,   title: "Orientation académique", desc: "Analyse de votre profil et recommandation des concours les plus adaptés." },
            { Icon: FiBook,     title: "Préparation intensive",   desc: "Cours quotidiens avec professeurs spécialisés par concours." },
            { Icon: FiCalendar, title: "Calendrier des concours", desc: "Dates, lieux, dossiers requis — toutes les informations centralisées." },
            { Icon: FiFileText, title: "Anciens sujets",          desc: "Accès aux anciens sujets corrigés pour s'entraîner efficacement." },
          ].map(({ Icon, title, desc }) => (
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

      {/* ── CONCOURS EN VEDETTE ── */}
      <section className="px-10 md:px-20 py-10 bg-[#f9fafb]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-clash text-[28px] font-bold mb-1">
              Concours <span className="text-[#1a7c3e]">à venir</span>
            </h2>
            <p className="text-[#666] text-sm">Les prochains concours pour lesquels nous vous préparons</p>
          </div>
          <button
            onClick={() => navigate("/concours")}
            className="hidden md:inline-flex items-center gap-1.5 text-[#1a7c3e] text-sm font-semibold hover:gap-2.5 transition-all cursor-pointer bg-transparent border-none"
          >
            Voir tous les concours <FiChevronRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <ClipLoader color="#1a7c3e" size={40} />
          </div>
        ) : concoursActifs.length === 0 ? (
          <div className="text-center py-12 text-[#888]">Aucun concours disponible pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {concoursActifs.map((c) => {
              const statut = getStatut(c.date_debut, c.date_fin);
              const dejaInscrit = inscritIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  className="border border-[#e0e0e0] rounded-2xl overflow-hidden hover:border-[#1a7c3e] hover:shadow-[0_8px_30px_rgba(26,124,62,0.12)] hover:-translate-y-1 transition-all bg-white"
                >
                  <div className="px-5 pt-5 pb-4 border-b border-[#e0e0e0]">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-[#f5f7f5] flex items-center justify-center text-[#1a7c3e]">
                        <HiOutlineBuildingLibrary size={22} />
                      </div>
                      <StatusPill statut={statut} />
                    </div>
                    <div className="font-clash text-[16px] font-bold mb-1">{c.nom}</div>
                    {c.description && (
                      <div className="text-xs text-[#666] leading-snug line-clamp-2">{c.description}</div>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {[
                        { Icon: FiCalendar,   label: "Début",       val: new Date(c.date_debut).toLocaleDateString("fr-FR") },
                        { Icon: FiCalendar,   label: "Fin",         val: new Date(c.date_fin).toLocaleDateString("fr-FR")   },
                        { Icon: FiDollarSign, label: "Inscription", val: `${c.inscription_prepa} €`                        },
                        { Icon: FiClock,      label: "Formation",   val: `${c.montant_prepa} €`                            },
                      ].map(({ Icon, label, val }) => (
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
                      {dejaInscrit ? "✅ Inscrit — Voir détails" : "Détails & s'inscrire"}
                      <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 md:hidden text-center">
          <button
            onClick={() => navigate("/concours")}
            className="inline-flex items-center gap-1.5 text-[#1a7c3e] text-sm font-semibold cursor-pointer bg-transparent border-none"
          >
            Voir tous les concours <FiChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* ── MATIÈRES ── */}
      {matieres.length > 0 && (
        <section className="px-10 md:px-20 py-14">
          <h2 className="font-clash text-[28px] font-bold mb-1.5">
            Matières <span className="text-[#1a7c3e]">enseignées</span>
          </h2>
          <p className="text-[#666] text-sm mb-8">Les disciplines couvertes dans nos programmes de préparation</p>
          <div className="flex flex-wrap gap-3">
            {matieres.map((m) => (
              <div
                key={m.id}
                className="bg-[#f5f7f5] border border-[#e0e0e0] rounded-xl px-4 py-3 hover:border-[#1a7c3e] hover:bg-[#d4f0df] transition-all cursor-default"
              >
                <div className="font-semibold text-[14px] text-[#0a0a0a]">{m.nom}</div>
                {m.description && (
                  <div className="text-[12px] text-[#666] mt-0.5">{m.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <div className="bg-[#1a7c3e] px-10 md:px-20 py-14 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="font-clash text-[28px] text-white font-bold">Prêt à intégrer votre grande école ?</h2>
          <p className="text-white/75 text-sm mt-1.5">Les cours de la session 2026 ont démarré — inscrivez-vous dès maintenant</p>
        </div>
        <button
          onClick={() => navigate("/concours")}
          className="px-7 py-3.5 bg-white text-[#1a7c3e] rounded-xl text-[15px] font-bold border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all whitespace-nowrap"
        >
          Voir les concours disponibles
        </button>
      </div>

      <Footer />
    </div>
  );
}
