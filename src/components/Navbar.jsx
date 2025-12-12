import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext";
import { FiSearch, FiBell } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";
import api from "../api/axios";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(false);


  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebounce(searchValue, 300);
  const dropdownRef = useRef();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") || "");
  }, [location.search]);

 
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


  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim() === "") {
      setSuggestions([]);
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

        [...movies, ...tvs].forEach((item) => {
          const key = `${item.media_type}-${item.id}`;
          map.set(key, item);
        });

        let list = Array.from(map.values());
        list = sortSuggestions(list, debouncedQuery);

        if (!cancelled) setSuggestions(list.slice(0, 8));
      } catch (err) {
        console.log("Suggestion Error:", err.message);
      }
    };

    load();
    return () => (cancelled = true);
  }, [debouncedQuery]);


  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      navigate(`/search?q=${searchValue}`);
      setShowDropdown(false);
    }
  };


  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const getInitials = () => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <nav className="
      fixed top-4 left-1/2 -translate-x-1/2 
      w-[95%] max-w-[1298px] h-[72px] 
      bg-[#222222] rounded-[70px] 
      z-50 flex items-center justify-between 
      px-6 shadow-lg">
      

      <Link to={user ? "/home" : "/"} className="w-[150px] h-10">
        <img src={Logo} className="w-full h-full object-contain" />
      </Link>

  
      {user && (
        <div className="relative" ref={dropdownRef}>
          <div className="
            flex items-center gap-3 
            bg-[#F6E7C6] text-gray-700 
            px-4 py-2 rounded-full 
            w-[320px] md:w-[380px]">
            
            <FiSearch size={18} className="opacity-60" />

            <input
              value={searchValue}
              onChange={handleSearchInput}
              onKeyDown={handleSearchSubmit}
              placeholder="Search Movies/TV Shows..."
              className="bg-transparent w-full focus:outline-none text-sm placeholder-gray-600"
            />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="
              absolute top-[52px] left-0 w-full 
              bg-[#222222] rounded-xl 
              shadow-xl text-white border border-slate-700 
              py-2 z-50">
              
              {suggestions.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="px-4 py-2 text-sm hover:bg-[#333] cursor-pointer"
                  onClick={() => {
                    navigate(`/search?q=${item.title || item.name}`);
                    setShowDropdown(false);
                  }}
                >
                  {item.title || item.name}
                  <span className="text-slate-400 text-xs ml-1">
                    ({getYear(item)} • {item.media_type === "tv" ? "Series" : "Movie"})
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

      <div className="flex items-center gap-8">

    
        <div className="flex gap-10 reem-kufi text-base font-semibold">
          <Link to={user ? "/home" : "/login"} className="text-[#F6E7C6] hover:text-white">
            Home
          </Link>

          {user && (
            <>
              <Link to="/explore" className="text-[#F6E7C6] hover:text-white">Explore</Link>
              <Link to="/watchlist" className="text-[#F6E7C6] hover:text-white">Watchlist</Link>
              <Link to="/booking" className="text-[#F6E7C6] hover:text-white">Book Show</Link>
            </>
          )}
        </div>

       
        {user && <FiBell size={22} className="text-[#F6E7C6] hover:text-white cursor-pointer" />}


        {!user && (
          <Link
            to="/signup"
            className="py-2.5 px-[30px] bg-[#FF7A1A] rounded-full hover:bg-[#f56c08] text-[#F6E7C6] text-base font-semibold"
          >
            Sign Up
          </Link>
        )}

    
        {user && (
          <div className="relative">
            <button
              className="h-11 w-11 rounded-full bg-[#3A3A3A] text-[#F6E7C6] border border-[#FF7A1A] overflow-hidden"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              {user.avatar ? (
                <img src={user.avatar} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-sm">{getInitials()}</span>
              )}
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 bg-[#222222] border border-slate-700 rounded-lg shadow-xl p-3 w-44">
                <p className="text-xs text-slate-400 px-2 pb-1">Signed in as</p>
                <p className="text-xs text-slate-200 px-2 mb-2 truncate">{user.email}</p>
                <hr className="border-slate-700 mb-2" />

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left py-2 px-3 text-sm hover:bg-slate-800/60 text-slate-200"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 text-sm text-red-400 hover:bg-red-900/40"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;