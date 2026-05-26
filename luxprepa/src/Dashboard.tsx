import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Concours {
  id: number;
  code: string;
  nom: string;
  ecole: string;
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  montantPaye: number;
  statut: "actif" | "bientot" | "passe";
}

interface AnnonceSegment {
  text: string;
  bold: boolean;
}

interface Annonce {
  id: number;
  date: string;
  segments: AnnonceSegment[];
}

// ─── Données fictives ─────────────────────────────────────────────────────────
const mockUser: User = {
  firstName: "Viviane",
  lastName: "Alima",
  email: "viviane.alima@email.com",
  phone: "+237 6XX XX XX XX",
};

const mockConcours: Concours[] = [
  {
    id: 1,
    code: "ENS",
    nom: "École Normale Supérieure",
    ecole: "ENS Yaoundé",
    dateDebut: "11 juin 2026",
    dateFin: "17 juil. 2026",
    montantTotal: 45000,
    montantPaye: 30000,
    statut: "actif",
  },
  {
    id: 2,
    code: "ENAM",
    nom: "École Nationale d'Administration",
    ecole: "ENAM Yaoundé",
    dateDebut: "28 mai 2026",
    dateFin: "30 mai 2026",
    montantTotal: 9500,
    montantPaye: 9500,
    statut: "bientot",
  },
  {
    id: 3,
    code: "ENSET",
    nom: "École Normale Supérieure d'Ens. Tech.",
    ecole: "ENSET Douala",
    dateDebut: "10 août 2026",
    dateFin: "16 août 2026",
    montantTotal: 42000,
    montantPaye: 5000,
    statut: "actif",
  },
];

const mockAnnonces: Annonce[] = [
  {
    id: 1,
    date: "26 mai 2026",
    segments: [
      { text: "📢 Résultats des concours blancs — ", bold: false },
      { text: "Félicitations à tous les élèves !", bold: true },
      { text: " La moyenne générale est de ", bold: false },
      { text: "14,2/20", bold: true },
      { text: " — un excellent résultat qui témoigne de vos efforts.", bold: false },
    ],
  },
  {
    id: 2,
    date: "22 mai 2026",
    segments: [
      { text: "Les révisions de ", bold: false },
      { text: "mathématiques et culture générale", bold: true },
      { text: " reprennent ce lundi à ", bold: false },
      { text: "8h00", bold: true },
      { text: ". Présence obligatoire.", bold: false },
    ],
  },
  {
    id: 3,
    date: "18 mai 2026",
    segments: [
      { text: "Rappel : les dossiers pour le concours ", bold: false },
      { text: "ENS 2026", bold: true },
      { text: " doivent être déposés avant le ", bold: false },
      { text: "1er juin 2026", bold: true },
      { text: ". Ne tardez pas !", bold: false },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

function Avatar({ user, size = "md" }: { user: User; size?: "sm" | "md" | "lg" }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const sz =
    size === "lg"
      ? "w-16 h-16 text-2xl"
      : size === "sm"
      ? "w-8 h-8 text-xs"
      : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-full bg-green-700 flex items-center justify-center font-bold text-white border-2 border-white shadow`}
    >
      {initials}
    </div>
  );
}

// ─── Page Concours ────────────────────────────────────────────────────────────
function PageConcours({ user }: { user: User }) {
  const statutLabel: Record<string, string> = {
    actif: "ACTIF",
    bientot: "BIENTÔT",
    passe: "PASSÉ",
  };
  const statutColor: Record<string, string> = {
    actif: "bg-green-100 text-green-700",
    bientot: "bg-yellow-100 text-yellow-700",
    passe: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="px-4 py-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Bonjour,</p>
          <h1 className="text-xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <Avatar user={user} size="md" />
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-700 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-75 mb-1">Total inscriptions</p>
          <p className="text-2xl font-bold">{mockConcours.length}</p>
          <p className="text-xs opacity-75">concours</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Reste à payer</p>
          <p className="text-lg font-bold text-red-500">
            {fmt(
              mockConcours.reduce(
                (acc, c) => acc + (c.montantTotal - c.montantPaye),
                0
              )
            )}
          </p>
        </div>
      </div>

      {/* Liste concours */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
        Mes concours
      </h2>
      <div className="space-y-3">
        {mockConcours.map((c) => {
          const reste = c.montantTotal - c.montantPaye;
          const pct = Math.round((c.montantPaye / c.montantTotal) * 100);
          return (
            <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 font-bold text-xs">
                    {c.code}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.ecole}</p>
                    <p className="text-xs text-gray-400">{c.dateDebut} → {c.dateFin}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statutColor[c.statut]}`}>
                  {statutLabel[c.statut]}
                </span>
              </div>

              {/* Barre de progression */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Payé : <span className="text-green-600 font-semibold">{fmt(c.montantPaye)}</span></span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Total : {fmt(c.montantTotal)}</span>
                  {reste > 0 ? (
                    <span className="text-red-500 font-semibold">Reste : {fmt(reste)}</span>
                  ) : (
                    <span className="text-green-600 font-semibold">✓ Soldé</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page Annonces ────────────────────────────────────────────────────────────
function PageAnnonces() {
  return (
    <div className="px-4 py-5 pb-24">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Annonces</h1>
      <p className="text-xs text-gray-400 mb-6">Messages de votre centre de prépa</p>

      <div className="space-y-4">
        {mockAnnonces.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-2">{a.date}</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {a.segments.map((seg, i) =>
                seg.bold ? (
                  <strong key={i} className="font-semibold text-gray-900">
                    {seg.text}
                  </strong>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page Paramètres ──────────────────────────────────────────────────────────
function PageParametres({
  user,
  setUser,
}: {
  user: User;
  setUser: (u: User) => void;
}) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    password: "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setUser({ ...user, firstName: form.firstName, lastName: form.lastName });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="px-4 py-5 pb-24">
      {/* Avatar centré */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg mb-3">
          {`${form.firstName[0] || "?"}${form.lastName[0] || "?"}`.toUpperCase()}
        </div>
        <p className="font-bold text-gray-800 text-lg">
          {form.firstName} {form.lastName}
        </p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
        Modifier mes informations
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Prénom</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="Prénom"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Nom</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="Nom"
          />
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            Changer le mot de passe
          </p>
          <div className="space-y-3">
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Nouveau mot de passe"
            />
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {saved && (
          <p className="text-xs text-green-600 bg-green-50 rounded-xl px-4 py-3">
            ✓ Modifications enregistrées avec succès.
          </p>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-green-700 text-white font-semibold rounded-xl py-3 text-sm hover:bg-green-800 active:scale-95 transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ─── Navigation bas ───────────────────────────────────────────────────────────
const navItems = [
  {
    id: "concours",
    label: "Concours",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "annonces",
    label: "Annonces",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: "parametres",
    label: "Paramètres",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("concours");
  const [user, setUser] = useState<User>(mockUser);

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto relative">
      {/* Contenu */}
      <main className="flex-1 overflow-y-auto">
        {page === "concours" && <PageConcours user={user} />}
        {page === "annonces" && <PageAnnonces />}
        {page === "parametres" && (
          <PageParametres user={user} setUser={setUser} />
        )}
      </main>

      {/* Navigation bas */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-lg">
        <div className="flex">
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative"
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-700 rounded-full" />
                )}
                {item.icon(active)}
                <span
                  className={`text-[10px] font-semibold ${
                    active ? "text-green-700" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}