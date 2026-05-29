import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { MdArrowBack, MdCheckCircle, MdSchool } from 'react-icons/md';
import { concoursApi, matiereApi, inscriptionApi } from "../api";
import type { Concours, Matiere } from "../api";

// Utilitaires
const getStatut = (debut: string, fin: string) => {
  const now = new Date();
  const start = new Date(debut);
  const end = new Date(fin);
  if (now < start) return 'à_venir';
  if (now >= start && now <= end) return 'en_cours';
  return 'terminé';
};

const statutBadge: Record<string, string> = {
  à_venir: 'badge-info',
  en_cours: 'badge-success',
  terminé: 'badge-ghost',
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const ConcoursPage = () => {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [inscritIds, setInscritIds] = useState<string[]>([]);
  const [inscriptionLoadingId, setInscriptionLoadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Concours | null>(null);

  // Chargement initial
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
        toast.error('Erreur lors du chargement des concours.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Inscription
  const handleInscrire = async (concoursId: string) => {
    setInscriptionLoadingId(concoursId);
    try {
      await inscriptionApi.inscrire(concoursId);
      setInscritIds((prev) => [...prev, concoursId]);
      toast.success('Inscription réussie !');
    } catch {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setInscriptionLoadingId(null);
    }
  };

  // Chargement en cours
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  // Vue détail d'un concours
  if (selected) {
    const statut = getStatut(selected.date_debut, selected.date_fin);
    const dejaInscrit = inscritIds.includes(selected.id);

    return (
      <div className="container mx-auto p-4 space-y-4">
        <button
          className="btn btn-ghost gap-2"
          onClick={() => setSelected(null)}
        >
          <MdArrowBack size={16} />
          Retour
        </button>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-2xl" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              {selected.nom}
            </h2>
            <span className={`badge ${statutBadge[statut]}`}>{statut.replace('_', ' ')}</span>
            <p className="text-base-content/70 mt-2">{selected.description}</p>

            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-base-content/40">Début :</span>{' '}
                {formatDate(selected.date_debut)}
              </div>
              <div>
                <span className="text-base-content/40">Fin :</span>{' '}
                {formatDate(selected.date_fin)}
              </div>
              <div>
                <span className="text-base-content/40">Frais :</span>{' '}
                {selected.montant_prepa?.toLocaleString()} FCFA
              </div>
            </div>

            {dejaInscrit ? (
              <div className="mt-4 flex items-center gap-2 text-success font-semibold">
                <MdCheckCircle size={20} />
                Vous êtes inscrit à ce concours
              </div>
            ) : (
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary gap-2"
                  onClick={() => handleInscrire(selected.id)}
                  disabled={inscriptionLoadingId === selected.id}
                >
                  {inscriptionLoadingId === selected.id ? (
                    <ClipLoader size={16} color="#fff" />
                  ) : (
                    <MdSchool size={16} />
                  )}
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Liste des concours
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        Concours disponibles
      </h1>
      <p className="text-base-content/50 text-sm">
        Le{concours.length > 1 ? 's' : ''} {concours.length} concour{concours.length > 1 ? 's' : ''} {concours.length > 1 ? 'auxquels' : 'auquel'} on vous prépare.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded text-sm shadow-sm">
        <strong>⚠️ Important :</strong> Aucun paiement n’est effectué via cette application.
        Les frais de concours sont à régler directement auprès de l’administration.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {concours.map((c) => {
          const statut = getStatut(c.date_debut, c.date_fin);
          const dejaInscrit = inscritIds.includes(c.id);

          return (
            <div
              key={c.id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(c)}
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h3 className="card-title text-base">{c.nom}</h3>
                  <span className={`badge badge-sm ${statutBadge[statut]}`}>
                    {statut.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-base-content/60 line-clamp-2 mt-2">
                  {c.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-semibold">
                    {c.montant_prepa?.toLocaleString()} FCFA
                  </span>
                  {dejaInscrit && (
                    <span className="text-success flex items-center gap-1 text-xs">
                      <MdCheckCircle size={14} />
                      Inscrit
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConcoursPage;
