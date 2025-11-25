import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Logo from "../assets/logo.svg";

import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1298px] h-[72px] bg-[#222222] rounded-[70px] z-50 flex items-center justify-between px-6 shadow-lg backdrop-blur-md bg-opacity-90">
      
      {/* Logo */}
      <div className="w-[150px] h-10">
        <img src={Logo} alt="Cinéa Logo" className="w-full h-full object-contain" />
      </div>

      <div className="flex items-center gap-12">
  <div className="flex px-6 gap-12 reem-kufi text-base font-semibold">
    <Link to={user?"/home":"/login"} className="text-[#F6E7C6] hover:text-white transition">
      Home
    </Link>

    {user && (
      <>
        <Link to="/explore" className="text-[#F6E7C6] hover:text-white transition">
          Explore
        </Link>

        <Link to="/watchlist" className="text-[#F6E7C6] hover:text-white transition">
          Watchlist
        </Link>

        <Link to="/booking" className="text-[#F6E7C6] hover:text-white transition">
          Book Show
        </Link>
      </>
    )}
  </div>

  {/* Auth Buttons */}
  {!user ? (
    <Link
      to="/signup"
      className="py-2.5 px-[30px] bg-[#FF7A1A] rounded-full hover:bg-[#f56c08] text-[#F6E7C6] transition reem-kufi text-base font-semibold"
    >
      Sign Up
    </Link>
  ) : (
    <button
      onClick={logoutUser}
      className="py-2.5 px-[30px] border border-[#FF7A1A] rounded-full text-[#FF7A1A] hover:bg-[#FF7A1A] hover:text-black transition reem-kufi text-base font-semibold"
    >
      Logout
    </button>
  )}
</div>

    </nav>
  );
};

export default Navbar;