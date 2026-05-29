import { useEffect, useState } from "react";
import type { FC } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import Navbar from "../components/navbar";
import HomeComponent from "../components/homepage";
import PageHeader from "../components/pageHeader";
import Footer from "../components/footer";
import ModalConcours from "../components/modalConcours";
import SessionCard from "../components/sessionCard";
import ConcoursCard from "../components/concoursCard";
import StatusPill from "../components/statusPill";
import { BsCircleFill, BsCircleHalf } from "react-icons/bs";
import { TbCircleOff } from "react-icons/tb";
import { concoursApi, matiereApi, sessionApi } from "../api";
import type { Concours, Matiere, Session } from "../api";

// Types internes
type Page = "accueil" | "concours" | "matieres" | "sessions";
type Statut = "actif" | "bientot" | "passe";
type SessTab = "encours" | "passees";

// Helper pour déterminer le statut d'un concours à partir de ses dates
const getStatut = (debut: string, fin?: string): Statut => {
  const now = new Date();
  const start = new Date(debut);
  const end = fin ? new Date(fin) : new Date(start.getTime() + 30 * 86400000); // 30 jours par défaut si pas de fin
  if (now < start) return "bientot";
  if (now >= start && now <= end) return "actif";
  return "passe";
};

const Home: FC = () => {
  const [page, setPage] = useState<Page>("accueil");
  console.log("Page actuelle :", page);
  
  const [filtre, setFiltre] = useState<"tous" | Statut>("tous");
  const [modalConcour, setModalConcour] = useState<Concours | null>(null);
  const [sessTab, setSessTab] = useState<SessTab>("encours");

  // Données chargées depuis l'API
  const [concours, setConcours] = useState<Concours[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [concoursData, matieresData, sessionsData] = await Promise.all([
          concoursApi.liste(),
          matiereApi.liste(),
          sessionApi.liste(),
        ]);
        setConcours(concoursData);
        setMatieres(matieresData);
        setSessions(sessionsData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filtrer les concours selon le filtre sélectionné
  const filteredConcours = filtre === "tous"
    ? concours
    : concours.filter((c) => getStatut(c.date_debut, c.date_fin) === filtre);

  // Séparer les sessions en cours / passées (selon date ?)
  const sessionsEncours = sessions.filter((s) => {
    if (!s.date) return false;
    return new Date(s.date) >= new Date();
  });
  const sessionsPassees = sessions.filter((s) => {
    if (!s.date) return true;
    return new Date(s.date) < new Date();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <ClipLoader color="#1a7c3e" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans',sans-serif] bg-white text-[#0a0a0a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .font-clash { font-family: 'Clash Display', sans-serif; }
      `}</style>

      {/* Modal */}
      <ModalConcours
        concour={modalConcour}
        statut={modalConcour ? getStatut(modalConcour.date_debut, modalConcour.date_fin) : "passe"}
        onClose={() => setModalConcour(null)}
        onInscrire={(id) => {
          toast.success(`Inscription au concours ${id} demandée`);
          setModalConcour(null);
        }}
      />

      {/* Contenu principal */}
      <main>
        {/* ACCUEIL */}
        {page === "accueil" && <HomeComponent />}

        {/* CONCOURS */}
        {page === "concours" && (
          <>
            <PageHeader
              title="Concours 2026"
              sub="Tous les concours pour lesquels LuXPrepa vous prépare"
            />
            <div className="px-10 md:px-20 pt-6 pb-0 flex flex-wrap gap-2.5 border-b border-[#e0e0e0]">
              {[
                { val: "tous", label: "Tous", Dot: null },
                { val: "actif", label: "Actifs", Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
                { val: "bientot", label: "Bientôt", Dot: () => <BsCircleHalf className="text-amber-500 text-[9px]" /> },
                { val: "passe", label: "Passés", Dot: () => <TbCircleOff className="text-gray-400 text-[10px]" /> },
              ].map(({ val, label, Dot }) => (
                <button
                  key={val}
                  onClick={() => setFiltre(val as typeof filtre)}
                  className={`mb-3 inline-flex items-center gap-1.5 px-[18px] py-2 rounded-full text-[13px] font-semibold border transition-all cursor-pointer ${filtre === val
                      ? "bg-[#1a7c3e] text-white border-[#1a7c3e]"
                      : "bg-white text-[#666] border-[#e0e0e0] hover:border-[#1a7c3e] hover:text-[#1a7c3e]"
                    }`}
                >
                  {Dot && <Dot />} {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-10 md:px-20 py-8 pb-14">
              {filteredConcours.length === 0 && (
                <p className="col-span-3 text-center text-[#888] text-sm py-12">
                  Aucun concours ne correspond à ce filtre.
                </p>
              )}
              {filteredConcours.map((c) => (
                <ConcoursCard
                  key={c.id}
                  concour={c}
                  statut={getStatut(c.date_debut, c.date_fin)}
                  onDetails={(concour) => setModalConcour(concour)}
                />
              ))}
            </div>
            <Footer compact />
          </>
        )}

        {/* MATIÈRES */}
        {page === "matieres" && (
          <>
            <PageHeader
              title="Matières enseignées"
              sub="Les disciplines couvertes dans nos programmes"
            />
            <div className="px-10 md:px-20 pt-7 pb-2">
              <p className="text-[#666] text-sm max-w-[600px]">
                LuXPrepa couvre l'ensemble des matières exigées par les grandes écoles.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-10 md:px-20 py-6 pb-14">
              {matieres.length === 0 && (
                <p className="col-span-3 text-center text-[#888] text-sm py-12">
                  Aucune matière disponible pour le moment.
                </p>
              )}
              {matieres.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-[#e0e0e0] rounded-2xl p-6 hover:border-[#1a7c3e] hover:shadow-[0_6px_24px_rgba(26,124,62,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden cursor-default"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1a7c3e]" />
                  <div className="absolute top-4 right-4 bg-[#d4f0df] text-[#0f4f27] text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Coeff {m.coeff ?? 1}
                  </div>
                  <div className="font-clash text-[17px] font-bold mb-1.5">{m.nom}</div>
                  <div className="text-[#666] text-[13px] leading-relaxed mb-4">{m.description}</div>
                </div>
              ))}
            </div>
            <Footer compact />
          </>
        )}

        {/* SESSIONS */}
        {page === "sessions" && (
          <>
            <PageHeader
              title="Sessions de préparation"
              sub="Toutes les sessions internes organisées par LuXPrepa"
            />
            <div className="flex px-10 md:px-20 pt-6 pb-0 border-b border-[#e0e0e0] gap-0">
              {[
                { key: "encours", label: "En cours", Dot: () => <BsCircleFill className="text-[#22a052] text-[8px]" /> },
                { key: "passees", label: "Passées", Dot: () => <TbCircleOff size={13} /> },
              ].map(({ key, label, Dot }) => (
                <button
                  key={key}
                  onClick={() => setSessTab(key as SessTab)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${sessTab === key
                      ? "text-[#1a7c3e] border-[#1a7c3e]"
                      : "text-[#666] border-transparent hover:text-[#1a7c3e]"
                    }`}
                >
                  <Dot /> {label}
                </button>
              ))}
            </div>
            <div className="px-10 md:px-20 py-8 pb-14 flex flex-col gap-4">
              {(sessTab === "encours" ? sessionsEncours : sessionsPassees).length === 0 && (
                <p className="text-center text-[#888] text-sm py-12">
                  Aucune session {sessTab === "encours" ? "en cours" : "passée"} pour le moment.
                </p>
              )}
              {(sessTab === "encours" ? sessionsEncours : sessionsPassees).map((s) => (
                <SessionCard key={s.id} session={s} type={sessTab} />
              ))}
            </div>
            <Footer compact />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
