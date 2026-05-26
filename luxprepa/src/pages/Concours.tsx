import { useState } from "react";

interface Matiere {
  id: number;
  nom: string;
  description: string;
  coefficient: number;
}
interface Session {
  id: number;
  nom: string;
  date: string;
  concours_nom: string;
  nombre_notes: number;
}
interface Concours {
  id: number;
  nom: string;
  description: string;
  montant_inscription: number;
  montant_formation: number;
  date_debut: string;
  date_fin: string;
  nombre_matieres: number;
  nombre_inscrits: number;
  matieres: Matiere[];
  sessions: Session[];
}

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

const STATUT_STYLE: Record<Statut, { badge: string; dot: string; label: string }> = {
  actif:    { badge: "bg-green-100 text-green-800",   dot: "bg-green-500",  label: "Actif"    },
  bientot:  { badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400", label: "Bientot"  },
  en_cours: { badge: "bg-blue-100 text-blue-800",     dot: "bg-blue-500",   label: "En cours" },
  passe:    { badge: "bg-gray-100 text-gray-500",     dot: "bg-gray-400",   label: "Passe"    },
};

const DEMO: Concours[] = [
  {
    id:1, nom:"ENS", description:"Ecole Normale Superieure de Yaounde",
    montant_inscription:5000, montant_formation:45000,
    date_debut:"2026-07-15", date_fin:"2026-07-17",
    nombre_matieres:3, nombre_inscrits:340,
    matieres:[
      {id:1,nom:"Mathematiques",description:"Algebre analyse et geometrie",coefficient:4},
      {id:2,nom:"Physique-Chimie",description:"Thermodynamique et chimie",coefficient:3},
      {id:3,nom:"Francais",description:"Litterature et expression ecrite",coefficient:2},
    ],
    sessions:[
      {id:1,nom:"Session Ecrits",date:"2026-07-15",concours_nom:"ENS",nombre_notes:3},
      {id:2,nom:"Session Oraux",date:"2026-07-17",concours_nom:"ENS",nombre_notes:2},
    ],
  },
  {
    id:2, nom:"ENAM", description:"Ecole Nationale d Administration et Magistrature",
    montant_inscription:7500, montant_formation:60000,
    date_debut:"2026-05-28", date_fin:"2026-05-30",
    nombre_matieres:3, nombre_inscrits:210,
    matieres:[
      {id:4,nom:"Droit constitutionnel",description:"Institutions et libertes",coefficient:4},
      {id:5,nom:"Economie",description:"Macro et microeconomie",coefficient:3},
      {id:6,nom:"Culture generale",description:"Actualite et connaissances",coefficient:2},
    ],
    sessions:[
      {id:3,nom:"Epreuves ecrites",date:"2026-05-28",concours_nom:"ENAM",nombre_notes:3},
      {id:4,nom:"Entretien oral",date:"2026-05-30",concours_nom:"ENAM",nombre_notes:1},
    ],
  },
  {
    id:3, nom:"ENSET", description:"Ecole Normale Superieure de l Enseignement Technique",
    montant_inscription:5000, montant_formation:42000,
    date_debut:"2026-08-12", date_fin:"2026-08-14",
    nombre_matieres:3, nombre_inscrits:180,
    matieres:[
      {id:7,nom:"Mathematiques",description:"Algebre lineaire et analyse",coefficient:5},
      {id:8,nom:"Physique",description:"Mecanique et electronique",coefficient:4},
      {id:9,nom:"Technologie",description:"Sciences de l ingenieur",coefficient:3},
    ],
    sessions:[
      {id:5,nom:"Phase ecrite",date:"2026-08-12",concours_nom:"ENSET",nombre_notes:3},
      {id:6,nom:"Phase orale",date:"2026-08-14",concours_nom:"ENSET",nombre_notes:2},
    ],
  },
  {
    id:4, nom:"FASA", description:"Faculte d Agronomie et des Sciences Agricoles",
    montant_inscription:4000, montant_formation:35000,
    date_debut:"2026-04-10", date_fin:"2026-04-12",
    nombre_matieres:3, nombre_inscrits:95,
    matieres:[
      {id:10,nom:"SVT",description:"Biologie et sciences de la vie",coefficient:4},
      {id:11,nom:"Chimie",description:"Chimie organique et minerale",coefficient:3},
      {id:12,nom:"Maths",description:"Statistiques et probabilites",coefficient:2},
    ],
    sessions:[
      {id:7,nom:"Epreuves",date:"2026-04-10",concours_nom:"FASA",nombre_notes:3},
    ],
  },
  {
    id:5, nom:"IRIC", description:"Institut des Relations Internationales du Cameroun",
    montant_inscription:8000, montant_formation:70000,
    date_debut:"2026-09-05", date_fin:"2026-09-07",
    nombre_matieres:3, nombre_inscrits:150,
    matieres:[
      {id:13,nom:"Droit international",description:"Relations diplomatiques",coefficient:4},
      {id:14,nom:"Geopolitique",description:"Enjeux mondiaux actuels",coefficient:3},
      {id:15,nom:"Anglais",description:"Expression et comprehension",coefficient:3},
    ],
    sessions:[
      {id:8,nom:"Ecrits",date:"2026-09-05",concours_nom:"IRIC",nombre_notes:3},
      {id:9,nom:"Oraux",date:"2026-09-07",concours_nom:"IRIC",nombre_notes:2},
    ],
  },
  {
    id:6, nom:"ESSEC", description:"Ecole Superieure des Sciences Economiques et Commerciales",
    montant_inscription:6000, montant_formation:55000,
    date_debut:"2026-05-23", date_fin:"2026-05-25",
    nombre_matieres:3, nombre_inscrits:265,
    matieres:[
      {id:16,nom:"Mathematiques",description:"Analyse et probabilites",coefficient:4},
      {id:17,nom:"Economie",description:"Economie generale",coefficient:3},
      {id:18,nom:"Gestion",description:"Comptabilite et finance",coefficient:3},
    ],
    sessions:[
      {id:10,nom:"Epreuves ecrites",date:"2026-05-23",concours_nom:"ESSEC",nombre_notes:3},
      {id:11,nom:"Entretien",date:"2026-05-25",concours_nom:"ESSEC",nombre_notes:1},
    ],
  },
];

const Logo = () => (
  <div className="flex items-center">
    <span className="font-black text-2xl text-green-700" style={{fontFamily:"Georgia,serif"}}>LuX</span>
    <span className="font-black text-2xl text-gray-900" style={{fontFamily:"Georgia,serif"}}>PREPA</span>
  </div>
);

const BadgeStatut = ({ statut }: { statut: Statut }) => {
  const s = STATUT_STYLE[statut];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${statut === "en_cours" ? "animate-pulse" : ""}`}/>
      {s.label}
    </span>
  );
};

const CarteConcours = ({ c, onDetail }: { c: Concours; onDetail: (c: Concours) => void }) => {
  const statut = getStatut(c.date_debut, c.date_fin);
  const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", {day:"2-digit",month:"short",year:"numeric"});
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-green-800 to-green-600 p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
            <span className="font-black text-white text-sm" style={{fontFamily:"Georgia,serif"}}>{c.nom.substring(0,2)}</span>
          </div>
          <BadgeStatut statut={statut}/>
        </div>
        <h3 className="text-white font-black text-xl mb-1">{c.nom}</h3>
        <p className="text-green-100 text-xs leading-relaxed line-clamp-2">{c.description}</p>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-xl p-2.5">
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Debut</p>
            <p className="text-green-700 font-bold text-xs mt-0.5">{fmt(c.date_debut)}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-2.5">
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Fin</p>
            <p className="text-red-600 font-bold text-xs mt-0.5">{fmt(c.date_fin)}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            {val:c.nombre_inscrits,label:"Inscrits"},
            {val:c.nombre_matieres,label:"Matieres"},
            {val:c.sessions.length,label:"Sessions"},
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="font-black text-gray-900 text-base leading-none">{s.val}</p>
              <p className="text-gray-400 text-[9px] font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-xl p-2.5">
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Inscription</p>
            <p className="text-green-700 font-black text-sm mt-0.5">{c.montant_inscription.toLocaleString()} <span className="text-[9px]">FCFA</span></p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5">
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Formation</p>
            <p className="text-blue-700 font-black text-sm mt-0.5">{c.montant_formation.toLocaleString()} <span className="text-[9px]">FCFA</span></p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {c.matieres.slice(0,3).map(m => (
            <span key={m.id} className="bg-green-50 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-green-200">{m.nom}</span>
          ))}
          {c.matieres.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">+{c.matieres.length - 3}</span>
          )}
        </div>
        <button onClick={() => onDetail(c)} className="mt-auto w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
          Voir les details et s inscrire
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
};

const ModalDetail = ({ c, onClose }: { c: Concours; onClose: () => void }) => {
  const [tab, setTab] = useState<"matieres"|"sessions">("matieres");
  const statut = getStatut(c.date_debut, c.date_fin);
  const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-green-800 to-green-600 p-6">
          <div className="flex justify-between items-start mb-3">
            <BadgeStatut statut={statut}/>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <h2 className="text-white font-black text-2xl mb-1">{c.nom}</h2>
          <p className="text-green-100 text-sm mb-4">{c.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Frais inscription</p>
              <p className="text-white font-black text-sm mt-1">{c.montant_inscription.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Frais formation</p>
              <p className="text-white font-black text-sm mt-1">{c.montant_formation.toLocaleString()} FCFA</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-xl p-2.5">
              <p className="text-white/50 text-[9px] font-bold uppercase">Debut</p>
              <p className="text-white text-xs font-bold">{fmt(c.date_debut)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <p className="text-white/50 text-[9px] font-bold uppercase">Fin</p>
              <p className="text-white text-xs font-bold">{fmt(c.date_fin)}</p>
            </div>
          </div>
        </div>
        <div className="flex border-b border-gray-100 px-6">
          {(["matieres","sessions"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-colors ${tab===t ? "border-green-700 text-green-700" : "border-transparent text-gray-400"}`}>
              {t === "matieres" ? `Matieres (${c.nombre_matieres})` : `Sessions (${c.sessions.length})`}
            </button>
          ))}
        </div>
        <div className="overflow-auto flex-1 p-5 space-y-3">
          {tab === "matieres" && c.matieres.map(m => (
            <div key={m.id} className="border border-gray-100 rounded-2xl p-4 flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm mb-1">{m.nom}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{m.description}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex flex-col items-center justify-center shrink-0">
                <span className="text-green-700 font-black text-base leading-none">{m.coefficient}</span>
                <span className="text-gray-400 text-[8px] font-bold uppercase">coef</span>
              </div>
            </div>
          ))}
          {tab === "sessions" && c.sessions.map((s, i) => (
            <div key={s.id} className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">{i+1}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm mb-1">{s.nom}</p>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-gray-400 text-xs">Date: {new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}</span>
                  <span className="text-gray-400 text-xs">Notes: {s.nombre_notes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="px-5 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors">Fermer</button>
          <button className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl transition-colors">S inscrire a ce concours</button>
        </div>
      </div>
    </div>
  );
};

export default function Concours() {
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<Statut|"tous">("tous");
  const [detail, setDetail] = useState<Concours|null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const filtered = DEMO.filter(c => {
    const s = getStatut(c.date_debut, c.date_fin);
    const matchS = filtreStatut === "tous" || s === filtreStatut;
    const matchQ = c.nom.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo/>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:block">{filtered.length} concours</span>
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors border border-green-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="#166534" strokeWidth="1.8" fill="none"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#166534" strokeWidth="1.8" fill="none"/>
                </svg>
              </button>
              {showSettings && (
                <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-52 z-50">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Parametres</p>
                  {["Mon profil","Notifications","Langue","Aide et Support"].map(item => (
                    <button key={item} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-medium transition-colors">{item}</button>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">Deconnexion</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-br from-green-800 to-green-600 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">Preparez votre avenir</p>
          <h1 className="text-white font-black text-3xl sm:text-4xl mb-2">Concours disponibles</h1>
          <p className="text-green-100 text-sm mb-6 max-w-lg">Choisissez votre concours et commencez votre preparation avec Luxprepa</p>
          <div className="relative max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="rgba(255,255,255,.6)" strokeWidth="1.8" fill="none"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="rgba(255,255,255,.6)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input placeholder="Rechercher un concours..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder:text-white/50 text-sm outline-none focus:border-white/50 transition-all"/>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
          {([
            {key:"tous",label:"Tous"},
            {key:"actif",label:"Actif"},
            {key:"bientot",label:"Bientot"},
            {key:"en_cours",label:"En cours"},
            {key:"passe",label:"Passe"},
          ] as {key:Statut|"tous";label:string}[]).map(f => (
            <button key={f.key} onClick={() => setFiltreStatut(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${filtreStatut===f.key ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-500 border-gray-200 hover:border-green-300"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">ðŸ”</p>
            <p className="font-bold text-gray-800 text-lg">Aucun concours trouve</p>
            <p className="text-gray-400 text-sm mt-1">Essayez un autre terme</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <CarteConcours key={c.id} c={c} onDetail={setDetail}/>
            ))}
          </div>
        )}
      </div>

      {detail && <ModalDetail c={detail} onClose={() => setDetail(null)}/>}
      {showSettings && <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}/>}
    </div>
  );
}
