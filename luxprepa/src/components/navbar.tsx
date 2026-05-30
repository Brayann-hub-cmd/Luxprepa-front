import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../images/logo.jpg";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Accueil",   to: "/"         },
    { label: "Concours",  to: "/concours" },
    { label: "Matières",  to: "/matieres" },
    { label: "Sessions",  to: "/sessions" },
  ];

  const isActive = (path: string) =>
    location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0]">
      <div className="flex items-center justify-between px-10 md:px-20 h-16">

        {/* ── LOGO ── */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="LuxPrepa" className="h-10 w-auto" />
        </Link>

        {/* ── LIENS DESKTOP ── */}
        <ul className="hidden md:flex gap-1 list-none m-0 p-0">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? "bg-[#d4f0df] text-[#0f4f27] font-semibold"
                    : "text-[#666] hover:bg-[#f5f7f5] hover:text-[#0a0a0a]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── BOUTONS DESKTOP ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#e0e0e0] text-[#666] hover:border-red-300 hover:text-red-500 transition-all cursor-pointer bg-transparent"
            >
              <FaSignOutAlt className="text-sm" />
              Se déconnecter
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#1a7c3e] text-[#1a7c3e] bg-transparent hover:bg-[#d4f0df] transition-all"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1a7c3e] text-white hover:bg-[#0f4f27] transition-all"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* ── BURGER MOBILE ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-[#0a0a0a] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#0a0a0a] transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#0a0a0a] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── MENU MOBILE ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e0e0e0] px-6 py-4 flex flex-col gap-2">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                  ? "bg-[#d4f0df] text-[#0f4f27] font-semibold"
                  : "text-[#666] hover:bg-[#f5f7f5]"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-[#e0e0e0] mt-2 pt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer bg-transparent border-none"
              >
                <FaSignOutAlt /> Se déconnecter
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#1a7c3e] text-[#1a7c3e] text-center hover:bg-[#d4f0df] transition-all"
                >
                  <FaUser className="inline mr-2" />
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1a7c3e] text-white text-center hover:bg-[#0f4f27] transition-all"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
