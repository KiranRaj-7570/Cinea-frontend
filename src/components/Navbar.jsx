import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext";
import { FiSearch, FiBell, FiMenu, FiX } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";
import api from "../api/axios";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebounce(searchValue, 300);
  const dropdownRef = useRef(null);

  /* ---------------- sync search from URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") || "");
  }, [location.search]);

  /* ---------------- helpers ---------------- */
  const getYear = (item) => {
    if (item.release_date) return item.release_date.split("-")[0];
    if (item.first_air_date) return item.first_air_date.split("-")[0];
    return "N/A";
  };

  const sortSuggestions = (items, q) => {
    const lower = q.toLowerCase();
    return items.sort((a, b) => {
      const nameA = (a.title || a.name).toLowerCase();
      const nameB = (b.title || b.name).toLowerCase();
      let scoreA = 0;
      let scoreB = 0;
      if (nameA.startsWith(lower)) scoreA += 10000;
      if (nameB.startsWith(lower)) scoreB += 10000;
      if (nameA.includes(lower)) scoreA += 5000;
      if (nameB.includes(lower)) scoreB += 5000;
      scoreA += (a.popularity || 0) * 10;
      scoreB += (b.popularity || 0) * 10;
      scoreA += (a.vote_average || 0) * 100;
      scoreB += (b.vote_average || 0) * 100;
      return scoreB - scoreA;
    });
  };

  /* ---------------- SEARCH SUGGESTIONS (RESTORED) ---------------- */
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          api.get(`/movies/search?query=${encodeURIComponent(debouncedQuery)}`),
          api.get(`/shows/search?query=${encodeURIComponent(debouncedQuery)}`),
        ]);

        const movies = (movieRes.data.results || []).map((i) => ({
          ...i,
          media_type: "movie",
        }));
        const tvs = (tvRes.data.results || []).map((i) => ({
          ...i,
          media_type: "tv",
        }));

        const map = new Map();
        [...movies, ...tvs].forEach((i) =>
          map.set(`${i.media_type}-${i.id}`, i)
        );

        const list = sortSuggestions([...map.values()], debouncedQuery);

        if (!cancelled) {
          setSuggestions(list.slice(0, 8));
          
        }
      } catch (err) {
        console.log("Suggestion error:", err.message);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  /* ---------------- CLICK OUTSIDE (ORIGINAL BEHAVIOR) ---------------- */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  /* ================================================================ */

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1298px] h-[72px] bg-[#222222] rounded-[70px] z-50 flex items-center px-4 md:px-6 shadow-lg">

      {/* LOGO */}
      <Link
        to={user ? "/home" : "/"}
        className="w-[100px] md:w-[150px] h-10 flex-shrink-0"
      >
        <img src={Logo} className="w-full h-full object-contain" />
      </Link>

      {/* SEARCH (DESKTOP + MOBILE) */}
      {user && (
        <div className="relative flex-1 mx-2 md:mx-6" ref={dropdownRef}>
          <div className="flex items-center gap-3 bg-[#F6E7C6] text-black px-3 md:px-4 py-2 rounded-full max-w-[380px] mx-auto">
            <FiSearch size={18} className="opacity-60" />
            <input
              value={searchValue}
              onChange={(e) => {
  setSearchValue(e.target.value);
  setShowDropdown(true); // 🔥 restore original behavior
}}
              onFocus={() => searchValue && setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  navigate(`/search?q=${searchValue}`);
                  setShowDropdown(false);
                }
              }}
              placeholder="Search Movies/TV Shows..."
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-[52px] w-full bg-[#222222] rounded-xl border border-slate-700 py-2 z-[999]">
              {suggestions.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => {
                    navigate(`/search?q=${item.title || item.name}`);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-[#333] cursor-pointer"
                >
                  {item.title || item.name}
                  <span className="text-xs text-slate-400 ml-1">
                    ({getYear(item)})
                  </span>
                </div>
              ))}

              <div
                onClick={() => navigate(`/search?q=${searchValue}`)}
                className="px-4 py-2 text-xs text-orange-300 hover:text-orange-400 cursor-pointer"
              >
                View all results →
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESKTOP RIGHT (UNCHANGED UI) */}
      <div className="hidden lg:flex items-center gap-8">
        <div className="flex gap-10 reem-kufi font-semibold">
          <NavLink to="/home" className="text-[#F6E7C6]">Home</NavLink>
          <NavLink to="/explore" className="text-[#F6E7C6]">Explore</NavLink>
          <NavLink to="/watchlist" className="text-[#F6E7C6]">Watchlist</NavLink>
          <NavLink to="/booking" className="text-[#F6E7C6]">Book Show</NavLink>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-1 border border-[#FF7A1A] rounded-full text-[#F6E7C6]"
          >
            Admin
          </button>
        )}

        <FiBell size={22} className="text-[#F6E7C6]" />

        {/* DESKTOP PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="h-11 w-11 rounded-full bg-[#3A3A3A] border border-[#FF7A1A]"
          />
          {openDropdown && (
            <div className="absolute right-0 mt-2 bg-[#222222] border border-slate-700 rounded-lg p-3 w-44">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left py-2 text-sm"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE HAMBURGER */}
      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        className="lg:hidden text-[#F6E7C6] ml-2"
      >
        {mobileMenu ? <FiX size={26} /> : <FiMenu size={26} />}
      </button>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="absolute top-[82px] left-0 w-full bg-[#222222] rounded-2xl p-6 flex flex-col gap-4 lg:hidden z-50">
          <NavLink to="/home" onClick={() => setMobileMenu(false)}>Home</NavLink>
          <NavLink to="/explore" onClick={() => setMobileMenu(false)}>Explore</NavLink>
          <NavLink to="/watchlist" onClick={() => setMobileMenu(false)}>Watchlist</NavLink>
          <NavLink to="/booking" onClick={() => setMobileMenu(false)}>Book Show</NavLink>

          <hr className="border-slate-700" />

          <button onClick={() => navigate("/profile")} className="text-left">
            Profile
          </button>
          <button onClick={handleLogout} className="text-left text-red-400">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
