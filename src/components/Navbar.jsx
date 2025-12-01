import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const getInitials = () => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1298px] h-[72px] bg-[#222222] rounded-[70px] z-50 flex items-center justify-between px-6 shadow-lg backdrop-blur-md bg-opacity-90">
      {/* Logo */}
      <div className="w-[150px] h-10 cursor-pointer">
        <Link to={user ? "/home" : "/"}>
          <img
            src={Logo}
            alt="Cinéa Logo"
            className="w-full h-full object-contain"
          />
        </Link>
      </div>

      {/* Links + Right Section */}
      <div className="flex items-center gap-12">
        {/* Links */}
        <div className="flex px-6 gap-12 reem-kufi text-base font-semibold">
          <Link
            to={user ? "/home" : "/login"}
            className="text-[#F6E7C6] hover:text-white transition"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/explore"
                className="text-[#F6E7C6] hover:text-white transition"
              >
                Explore
              </Link>

              <Link
                to="/watchlist"
                className="text-[#F6E7C6] hover:text-white transition"
              >
                Watchlist
              </Link>

              <Link
                to="/booking"
                className="text-[#F6E7C6] hover:text-white transition"
              >
                Book Show
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        {!user ? (
          <Link
            to="/signup"
            className="py-2.5 px-[30px] bg-[#FF7A1A] rounded-full hover:bg-[#f56c08] text-[#F6E7C6] transition reem-kufi text-base font-semibold"
          >
            Sign Up
          </Link>
        ) : (
          <div className="relative">
            {/* Avatar button */}
            <button
              className="h-11 w-11 rounded-full bg-[#3A3A3A] text-[#F6E7C6] flex items-center justify-center select-none border border-[#FF7A1A] shadow-md hover:opacity-90 transition overflow-hidden"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-bold text-sm">{getInitials()}</span>
              )}
            </button>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 bg-[#0B1120] border border-slate-700 rounded-lg shadow-xl p-3 w-44">
                <p className="text-xs text-slate-400 px-2 pb-1">
                  Signed in as
                </p>
                <p className="text-xs text-slate-200 px-2 mb-2 truncate">
                  {user.email}
                </p>
                <hr className="border-slate-700 mb-2" />

                <button
                  onClick={() => {
                    setOpenDropdown(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left text-sm text-slate-200 hover:text-white hover:bg-slate-800/60 py-2 px-3 rounded transition"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-400 hover:text-red-500 hover:bg-red-950/40 py-2 px-3 rounded transition mt-1"
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