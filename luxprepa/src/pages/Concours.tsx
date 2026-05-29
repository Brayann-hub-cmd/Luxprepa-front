import { useState, useEffect } from "react";
import { concoursApi, matiereApi, inscriptionApi } from "../api";
import type { Concours, Matiere } from "../api";
import { toast, Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

// ── Statut automatique selon les dates ──
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

const statutStyle: Record<Statut, string> = {
  actif: "badge badge-info",
  bientot: "badge badge-warning",
  en_cours: "badge badge-success",
  passe: "badge badge-ghost",
};

const statutLabel: Record<Statut, string> = {
  actif: "À venir",
  bientot: "Bientôt",
  en_cours: "En cours",
  passe: "Terminé",
};

export default function ConcoursPage() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Concours | null>(null);
  const [inscriptionLoadingId, setInscriptionLoadingId] = useState<string | null>(null);
  const [inscritIds, setInscritIds] = useState<string[]>([]);

  // ── Chargement initial ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listeConcours, listeMatieres] = await Promise.all([
          concoursApi.liste(),
          matiereApi.liste(),
        ]);
        setConcours(listeConcours);
        setMatieres(listeMatieres);
      } catch {
        toast.error("Erreur lors du chargement des concours.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── S'inscrire à un concours (seul POST) ──
  const handleInscrire = async (concoursId: string) => {
    setInscriptionLoadingId(concoursId);
    try {
      await inscriptionApi.inscrire(concoursId);
      setInscritIds((prev) => [...prev, concoursId]);
      toast.success("Inscription réussie !");
    } catch {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setInscriptionLoadingId(null);
    }
  };

  // ── Chargement ──
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  // ── Vue détail d'un concours ──
  if (selected) {
    const statut = getStatut(selected.date_debut, selected.date_fin);
    const dejaInscrit = inscritIds.includes(selected.id);

    return (
      <div className="max-w-3xl mx-auto p-6 font-sans">
        <Toaster position="top-right" />
        <button
          className="btn btn-ghost mb-4"
          onClick={() => setSelected(null)}
        >
          ← Retour
        </button>

        <div className="card bg-base-100 shadow-lg border border-base-200 p-6">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-base-content">{selected.nom}</h1>
            <span className={statutStyle[statut]}>{statutLabel[statut]}</span>
          </div>

          {selected.description && (
            <p className="text-base-content/60 mb-6">{selected.description}</p>
          )}

          {/* Infos principales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-xl p-4">
              <div className="stat-title">Date début</div>
              <div className="stat-value text-lg">
                {new Date(selected.date_debut).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-4">
              <div className="stat-title">Date fin</div>
              <div className="stat-value text-lg">
                {new Date(selected.date_fin).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-4">
              <div className="stat-title">Frais d'inscription</div>
              <div className="stat-value text-lg">{selected.inscription_prepa} €</div>
            </div>
            <div className="stat bg-base-200 rounded-xl p-4">
              <div className="stat-title">Frais de formation</div>
              <div className="stat-value text-lg">{selected.montant_prepa} €</div>
            </div>
            {selected.nombre_inscrits !== undefined && (
              <div className="stat bg-base-200 rounded-xl p-4">
                <div className="stat-title">Inscrits</div>
                <div className="stat-value text-lg">{selected.nombre_inscrits}</div>
              </div>
            )}
            {selected.nombre_matieres !== undefined && (
              <div className="stat bg-base-200 rounded-xl p-4">
                <div className="stat-title">Matières</div>
                <div className="stat-value text-lg">{selected.nombre_matieres}</div>
              </div>
            )}
          </div>

          {/* Matières du concours */}
          {selected.matieres && selected.matieres.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-3">Matières</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Coefficient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.matieres.map((m) => (
                      <tr key={m.id}>
                        <td>{m.matiere_nom}</td>
                        <td>{m.coefficient}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bouton inscription */}
          {statut !== "passe" && (
            <div className="mt-4">
              {dejaInscrit ? (
                <div className="alert alert-success">
                  <span>✅ Vous êtes inscrit à ce concours !</span>
                </div>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  disabled={inscriptionLoadingId === selected.id}
                  onClick={() => handleInscrire(selected.id)}
                >
                  {inscriptionLoadingId === selected.id ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : (
                    "S'inscrire à ce concours"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Vue liste ──
  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-base-content">Concours disponibles</h1>

      {concours.length === 0 ? (
        <div className="alert alert-info">
          <span>Aucun concours disponible pour le moment.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concours.map((c) => {
            const statut = getStatut(c.date_debut, c.date_fin);
            const dejaInscrit = inscritIds.includes(c.id);

            return (
              <div key={c.id} className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow">
                <div className="card-body">
                  {/* En-tête carte */}
                  <div className="flex justify-between items-start">
                    <h2 className="card-title text-base-content">{c.nom}</h2>
                    <span className={statutStyle[statut]}>{statutLabel[statut]}</span>
                  </div>

                  {c.description && (
                    <p className="text-sm text-base-content/60 line-clamp-2">{c.description}</p>
                  )}

                  {/* Infos rapides */}
                  <div className="text-sm text-base-content/70 mt-2 space-y-1">
                    <p>
                      📅 <span className="font-medium">Début :</span>{" "}
                      {new Date(c.date_debut).toLocaleDateString("fr-FR")}
                    </p>
                    <p>
                      💰 <span className="font-medium">Inscription :</span>{" "}
                      {c.inscription_prepa} €
                    </p>
                    {c.nombre_inscrits !== undefined && (
                      <p>
                        👥 <span className="font-medium">Inscrits :</span>{" "}
                        {c.nombre_inscrits}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4 gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelected(c)}
                    >
                      Détails
                    </button>

                    {statut !== "passe" && (
                      dejaInscrit ? (
                        <span className="btn btn-success btn-sm no-animation">
                          ✅ Inscrit
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={inscriptionLoadingId === c.id}
                          onClick={() => handleInscrire(c.id)}
                        >
                          {inscriptionLoadingId === c.id ? (
                            <ClipLoader color="#fff" size={14} />
                          ) : (
                            "S'inscrire"
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
