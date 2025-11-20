import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/logo.svg";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1298px] h-[72px] bg-[#222222] rounded-[70px] z-50 flex items-center justify-between px-6 shadow-lg backdrop-blur-md bg-opacity-90">
      
      {/* Logo */}
      <div className="w-[150px] h-10">
        <img src={Logo} alt="Cinéa Logo" className="w-full h-full object-contain" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-12">
        <div className="flex px-6 gap-12 reem-kufi text-base font-semibold">
          <Link to="/" className="text-[#F6E7C6] hover:text-white transition">Home</Link>
          <Link to="/explore" className="text-[#F6E7C6] hover:text-white transition">Explore</Link>
          <Link to="/watchlist" className="text-[#F6E7C6] hover:text-white transition">Watchlist</Link>
          <Link to="/booking" className="text-[#F6E7C6] hover:text-white transition">Book Show</Link>
        </div>

        {/* Button */}
        <Link
          to="/signup"
          className="py-2.5 px-[30px] bg-[#FF7A1A] rounded-full hover:bg-[#f56c08] text-[#F6E7C6] transition reem-kufi text-base font-semibold"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-[#F6E7C6]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#222222] rounded-2xl flex flex-col items-center gap-6 py-6 lg:hidden text-base font-semibold shadow-xl animate-slideDown">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-[#F6E7C6]">Home</Link>
          <Link to="/explore" onClick={() => setIsOpen(false)} className="text-[#F6E7C6]">Explore</Link>
          <Link to="/watchlist" onClick={() => setIsOpen(false)} className="text-[#F6E7C6]">Watchlist</Link>
          <Link to="/booking" onClick={() => setIsOpen(false)} className="text-[#F6E7C6]">Movie Booking</Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="py-2.5 px-8 bg-[#FF7A1A] rounded-full text-[#222222] font-semibold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;