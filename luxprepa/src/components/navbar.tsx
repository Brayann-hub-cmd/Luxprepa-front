import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { FC } from "react";
import { FiHome, FiTarget, FiBook, FiCalendar } from "react-icons/fi";
import { MdMenu, MdClose } from "react-icons/md";

type Page = "accueil" | "concours" | "matieres" | "sessions";

interface NavbarProps {
  page: Page;
  setPage: (page: Page) => void;
}

const Navbar: FC<NavbarProps> = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links: { label: string; key: Page; icon: React.ElementType; lien: string }[] = [
    { label: "Accueil", key: "accueil", icon: FiHome, lien: "/" },
    { label: "Concours", key: "concours", icon: FiTarget, lien: "/concours" },
    { label: "Matières", key: "matieres", icon: FiBook, lien: "/" },
    { label: "Sessions", key: "sessions", icon: FiCalendar, lien: "/" },
  ];

  const handleNavigation = (key: Page, lien: string) => {
    setPage(key);
    navigate(lien);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-base-200 shadow-sm h-16 flex items-center justify-between px-4 md:px-12">
      {/* Logo */}
      <button
        onClick={() => handleNavigation("accueil", "/")}
        className="font-clash text-xl md:text-[22px] font-bold cursor-pointer"
      >
        <span className="text-[#1a7c3e]">Lu</span>
        <span className="text-[#1a7c3e]">X</span>
        <span className="text-base-content">PREPA</span>
      </button>

      {/* Navigation desktop */}
      <ul className="hidden md:flex gap-1">
        {links.map((link) => (
          <li key={link.key}>
            <button
              onClick={() => handleNavigation(link.key, link.lien)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none ${
                page === link.key
                  ? "bg-[#d4f0df] text-[#0f4f27] font-semibold"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Boutons connexion / inscription (desktop) */}
      <div className="hidden md:flex gap-2.5">
        <Link to="/login">
          <button className="btn btn-sm btn-outline border-[#1a7c3e] text-[#1a7c3e] hover:bg-[#d4f0df] hover:border-[#1a7c3e]">
            Se connecter
          </button>
        </Link>
        <Link to="/register">
          <button className="btn btn-sm bg-[#1a7c3e] text-white hover:bg-[#0f4f27] border-none">
            S'inscrire
          </button>
        </Link>
      </div>

      {/* Hamburger mobile */}
      <button
        className="md:hidden btn btn-ghost btn-circle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-base-200 shadow-lg md:hidden z-50">
          <ul className="flex flex-col p-4 gap-2">
            {links.map((link) => (
              <li key={link.key}>
                <button
                  onClick={() => handleNavigation(link.key, link.lien)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    page === link.key
                      ? "bg-[#d4f0df] text-[#0f4f27] font-semibold"
                      : "text-base-content/70 hover:bg-base-200"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <hr className="my-2" />
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full btn btn-sm btn-outline border-[#1a7c3e] text-[#1a7c3e]">
                Se connecter
              </button>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <button className="w-full btn btn-sm bg-[#1a7c3e] text-white">
                S'inscrire
              </button>
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
