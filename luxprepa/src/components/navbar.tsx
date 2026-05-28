import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaSignOutAlt, 
} from "react-icons/fa";
import logo from '../images/logo.jpg'
export default function Navbar({ setTitle, setCategorie }) {
  const [language, setLanguage] = useState("FRA");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [categorySelected, setCategorySelected] = useState("CAT_000")

  //AJOUT : état de connexion 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifie si un token existe dans le localStorage
    // const token = localStorage.getItem("token");
    // setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate('/');
  };

  // Refs séparées pour chaque vue
  const categoryDesktopRef = useRef(null);
  const categoryTabletRef = useRef(null);
  const categoryMobileRef = useRef(null);

  useEffect(() => {
    const getCategorie = async () => {
      try {
        
      } catch (error) {
        
      }
    }
    getCategorie();
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    setTitle(searchTerm)
    setCategorie(categorySelected)
    try {
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    setCategorySelected(selectedCategory);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3">

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden lg:flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="TechShop" className="h-[4em] w-auto" />
          </Link>

          {/* ── AJOUT : Se connecter / Se déconnecter (Desktop) ── */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm hover:text-purple-500 whitespace-nowrap transition-colors"
            >
              <FaSignOutAlt className="text-sm" />
              <span>Se déconnecter</span>
            </button>
          ) : (
            <Link
              to="auth/login"
              className="flex items-center gap-2 text-sm hover:text-purple-500 whitespace-nowrap transition-colors"
            >
              <FaUser className="text-sm" />
              <span>Se connecter</span>
            </Link>
          )}

          {/* REGISTER */}
          <Link
            to="auth/register"
            className="text-sm font-medium hover:text-purple-500 whitespace-nowrap transition-colors"
          >
            S'inscrire
          </Link>

          {/* CART */}
          <Link
            to={'/panier'}
            className="relative hover:text-purple-500 transition-colors"
          >
            <FaShoppingCart className="text-lg" />
            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">{cartCount}</span>
          </Link>
        </div>

        {/*  TABLET LAYOUT (md à lg)  */}
        <div className="hidden md:flex lg:hidden items-center justify-between gap-2">
          <Link to="/"><img src={logo} alt="Techshop" className="h-[4em] w-auto" /></Link>

          {/* AJOUT : Se connecter / Se déconnecter (Tablet) */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-purple-500 transition-colors">
              <FaSignOutAlt className="text-sm" />
            </button>
          ) : (
            <Link to={'/auth/login'} className="hover:text-purple-500">
              <FaUser className="text-sm" />
            </Link>
          )}

          <Link to={'/auth/register'} className="text-xs font-medium hover:text-purple-500 whitespace-nowrap">
            S'inscrire
          </Link>

          <Link to={'/panier'} className="relative hover:text-purple-500">
            <FaShoppingCart className="text-sm" />
            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
          </Link>
        </div>

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <Link to="/"><img src={logo} alt="Techshop" className="h-6 w-auto" /></Link>
            <div className="flex items-center gap-3">

              {/* ── AJOUT : Se connecter / Se déconnecter (Mobile) ── */}
              {isLoggedIn ? (
                <button onClick={handleLogout} className="hover:text-purple-500 transition-colors">
                  <FaSignOutAlt className="text-sm" />
                </button>
              ) : (
                <Link to={'/auth/login'} className="hover:text-purple-500">
                  <FaUser className="text-sm" />
                </Link>
              )}

              <Link to={'/auth/register'} className="text-xs font-medium hover:text-purple-500 whitespace-nowrap">
                S'inscrire
              </Link>

              <Link to={'/panier'} className="relative hover:text-purple-500">
                <FaShoppingCart className="text-sm" />
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
