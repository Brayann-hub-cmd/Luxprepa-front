// Home.tsx
import { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { BsCircleFill } from 'react-icons/bs';
import { FiChevronRight, FiTarget, FiBook, FiCalendar, FiFileText } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const HomeComponent = () => {
  const [page, setPage] = useState<string>('accueil');

  return (
    <div>
      {/* Navbar améliorée */}
      <Navbar page={page} setPage={setPage} />

      {/* Contenu conditionnel selon la page */}
      {page === 'accueil' && (
        <div>
          {/* Hero */}
          <section className="bg-[#0a0a0a] min-h-[500px] grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20 py-16 relative overflow-hidden gap-10">
            <div
              className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(26,124,62,0.35) 0%, transparent 70%)' }}
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
                  onClick={() => setPage('concours')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold bg-[#1a7c3e] text-white hover:bg-[#22a052] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,124,62,0.4)] transition-all cursor-pointer border-none"
                >
                  Voir les concours <FiChevronRight />
                </button>
                <button
                  onClick={() => setPage('sessions')}
                  className="px-7 py-3.5 rounded-xl text-[15px] font-bold bg-transparent border border-[#444] text-[#ccc] hover:border-[#888] hover:text-white transition-all cursor-pointer"
                >
                  Nos sessions
                </button>
              </div>
            </div>
            <div className="relative z-10 hidden md:flex justify-center">
              <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
                {[
                  { num: '+500', lbl: 'Candidats préparés cette année', full: true },
                  { num: '13', lbl: 'Grandes écoles couvertes', full: false },
                  { num: '8', lbl: "Années d'expérience", full: false },
                ].map(({ num, lbl, full }) => (
                  <div
                    key={lbl}
                    className={`${full ? 'col-span-2 bg-[rgba(26,124,62,0.15)] border-[rgba(26,124,62,0.3)]' : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]'} border rounded-2xl p-6 hover:bg-[rgba(26,124,62,0.25)] hover:border-[rgba(26,124,62,0.4)] transition-all`}
                  >
                    <div className="font-clash text-[40px] font-bold text-[#22a052]">{num}</div>
                    <div className="text-[#aaa] text-[13px] mt-1">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Message d'attention – paiement hors ligne */}
          <div className="px-10 md:px-20 pt-8">
            <div className="alert alert-warning shadow-sm flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div>
                <h3 className="font-semibold text-sm">Aucun paiement en ligne</h3>
                <p className="text-sm text-base-content/70">
                  L’inscription est gratuite sur cette plateforme. Le paiement des frais de concours s’effectue <strong>uniquement</strong> auprès de l’administration (par virement, mobile money ou en espèces).
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <section className="px-10 md:px-20 py-14">
            <h2 className="font-clash text-[28px] font-bold mb-1.5">
              Nos <span className="text-[#1a7c3e]">Services</span>
            </h2>
            <p className="text-[#666] text-sm mb-9">Un accompagnement complet de A à Z pour réussir vos concours</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(
                [
                  { Icon: FiTarget, title: 'Orientation académique', desc: 'Analyse de votre profil et recommandation des concours les plus adaptés.' },
                  { Icon: FiBook, title: 'Préparation intensive', desc: 'Cours quotidiens avec professeurs spécialisés par concours.' },
                  { Icon: FiCalendar, title: 'Calendrier des concours', desc: 'Dates, lieux, dossiers requis — toutes les informations centralisées.' },
                  { Icon: FiFileText, title: 'Anciens sujets', desc: 'Accès aux bords et anciens sujets corrigés pour s\'entraîner efficacement.' },
                ] as { Icon: IconType; title: string; desc: string }[]
              ).map(({ Icon, title, desc }) => (
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

          {/* CTA */}
          <div className="bg-[#1a7c3e] px-10 md:px-20 py-14 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="font-clash text-[28px] text-white font-bold">Prêt à intégrer votre grande école ?</h2>
              <p className="text-white/75 text-sm mt-1.5">Les cours de la session 2026 ont démarré — inscrivez-vous dès maintenant</p>
            </div>
            <button
              onClick={() => setPage('concours')}
              className="px-7 py-3.5 bg-white text-[#1a7c3e] rounded-xl text-[15px] font-bold border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all whitespace-nowrap"
            >
              Voir les concours disponibles
            </button>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
