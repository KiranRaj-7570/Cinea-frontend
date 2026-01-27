import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext";
import { FiSearch, FiBell, FiMenu, FiX } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";
import api from "../api/axios";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsModal from "./NotificationsModal";
import avatarPlaceholder from "../assets/avatar.png";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebounce(searchValue, 300);
  const dropdownRef = useRef(null);


  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const res = await api.get("/notifications/count/unread");
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);


  useEffect(() => {
    if (!notificationsOpen) {
      fetchUnreadCount();
    }
  }, [notificationsOpen]);


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
      setShowDropdown(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          api.get(`/movies/search?query=${encodeURIComponent(debouncedQuery)}`),
          api.get(
            `/tvshows/search?query=${encodeURIComponent(debouncedQuery)}`
          ),
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
        [...movies, ...tvs].forEach((item) =>
          map.set(`${item.media_type}-${item.id}`, item)
        );

        let list = Array.from(map.values());

        const q = searchValue.toLowerCase();
        list = list.filter((item) => {
          const name = (item.title || item.name || "").toLowerCase();
          return name.includes(q);
        });

        list = sortSuggestions(list, q);

        if (!cancelled) setSuggestions(list.slice(0, 8));
      } catch (err) {
        console.log("Suggestion error:", err.message);
      }
    };

    load();
    return () => (cancelled = true);
  }, [debouncedQuery, searchValue]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };


  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1298px] h-[72px] bg-[#222222] rounded-[70px] z-50 flex items-center px-4 md:px-6 shadow-lg">
      {/* LOGO */}
      <Link
        to={user ? "/home" : "/"}
        className="w-[100px] md:w-[150px] h-10 shrink-0"
      >
        <img src={Logo} className="w-full h-full object-contain" />
      </Link>

      {/* SEARCH */}
      {user && (
        <div className="relative flex-1 mx-2 md:mx-6" ref={dropdownRef}>
          <div className="flex items-center gap-3 bg-[#F6E7C6] text-[#222222] px-3 md:px-4 py-2 rounded-full max-w-[380px] mx-auto">
            <FiSearch size={18} className="opacity-60" />
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowDropdown(true);
              }}
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
            <div className="absolute top-[52px] w-full bg-[#222222] text-[#F6E7C6] rounded-xl border border-slate-700 py-2 z-999">
              {suggestions.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => {
                    if (item.media_type === "movie") {
                      navigate(`/movie/${item.id}`);
                    } else {
                      navigate(`/series/${item.id}`);
                    }
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-[#333] cursor-pointer"
                >
                  {item.title || item.name}
                  <span className="text-xs text-slate-400 ml-1">
                    ({getYear(item)} •{" "}
                    {item.media_type === "tv" ? "Series" : "Movie"})
                  </span>
                </div>
              ))}

              <div
                onClick={() => {
                  navigate(`/search?q=${searchValue}`);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 text-xs text-orange-300 hover:text-orange-400 cursor-pointer"
              >
                View all results →
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESKTOP RIGHT */}
      <div className="hidden lg:flex items-center gap-8 ml-auto">
        {user ? (
          <>
            <div className="flex gap-10 reem-kufi font-semibold ">
              <NavLink to="/home" className="text-[#F6E7C6] hover:text-orange-400 transition">
                Home
              </NavLink>
              <NavLink to="/explore" className="text-[#F6E7C6] hover:text-orange-400 transition">
                Explore
              </NavLink>
              <NavLink to="/watchlist" className="text-[#F6E7C6] hover:text-orange-400 transition">
                Watchlist
              </NavLink>
              <NavLink to="/booking" className="text-[#F6E7C6] hover:text-orange-400 transition">
                Book Show
              </NavLink>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-1 reem-kufi  text-[#F6E7C6] hover:text-orange-400 transition"
              >
                Admin
              </button>
            )}
 
            <button
              onClick={() => setNotificationsOpen(true)}
              className="text-[#F6E7C6] hover:text-orange-400 transition cursor-pointer relative flex items-center justify-center p-1"
            >
              <FiBell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF7A1A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

         
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.avatar || avatarPlaceholder}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {open && (
                <ProfileDropdown onClose={() => setOpen(false)} />
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-[#FF7A1A] text-white rounded-full reem-kufi font-semibold hover:bg-orange-500 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* NOTIFICATIONS MODAL */}
      <NotificationsModal 
        open={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
      {user && (
  <button
    onClick={() => setMobileMenu(!mobileMenu)}
    className="lg:hidden text-[#F6E7C6] ml-2"
  >
    {mobileMenu ? <FiX size={26} /> : <FiMenu size={26} />}
  </button>
)}

      {/* MOBILE MENU */}
      {mobileMenu && (
  <div className="absolute top-[82px] left-0 w-full bg-[#1b1b1b] rounded-2xl p-3 flex flex-col gap-1 lg:hidden z-50 shadow-xl border border-white/5 text-[#F6E7C6]">

    {/* PRIMARY NAV */}
    <NavLink
      to="/home"
      onClick={() => setMobileMenu(false)}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition"
    >
      Home
    </NavLink>

    <NavLink
      to="/explore"
      onClick={() => setMobileMenu(false)}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition"
    >
      Explore
    </NavLink>

    <NavLink
      to="/watchlist"
      onClick={() => setMobileMenu(false)}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition"
    >
      Watchlist
    </NavLink>

    <NavLink
      to="/booking"
      onClick={() => setMobileMenu(false)}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition"
    >
      Book Show
    </NavLink>

    {/* DIVIDER */}
    <div className="my-2 h-px bg-white/10" />

    {/* NOTIFICATIONS */}
    <button
      onClick={() => {
        setNotificationsOpen(true);
        setMobileMenu(false);
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-left"
    >
      <FiBell size={18} className="text-[#F6E7C6]" />
      <span className="text-[#F6E7C6]">Notifications</span>

      {unreadCount > 0 && (
        <span className="ml-auto bg-[#FF7A1A] text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>

    {/* ADMIN (only if admin) */}
    {user?.role === "admin" && (
      <button
        onClick={() => {
          navigate("/admin");
          setMobileMenu(false);
        }}
        className="px-4 py-3 rounded-xl hover:bg-white/5 transition text-left text-[#F6E7C6]"
      >
        Admin
      </button>
    )}

    {/* DIVIDER */}
    <div className="my-2 h-px bg-white/10" />

    {/* PROFILE ACTIONS */}
    <button
      onClick={() => {
        navigate("/profile");
        setMobileMenu(false);
      }}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition text-left"
    >
      Profile
    </button>

    <button
      onClick={() => {
        navigate("/my-bookings");
        setMobileMenu(false);
      }}
      className="px-4 py-3 rounded-xl hover:bg-white/5 transition text-left"
    >
      My Bookings
    </button>

    {/* LOGOUT */}
    <button
      onClick={handleLogout}
      className="px-4 py-3 rounded-xl hover:bg-red-500/10 transition text-left text-red-400"
    >
      Logout
    </button>
  </div>
)}

    </nav>
  );
};

export default Navbar;
