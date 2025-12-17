import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ticket, LogOut } from "lucide-react";
import avatarPlaceholder from "../assets/avatar.png";

const ProfileDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="absolute right-0 mt-3 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden z-50">

      {/* 👤 Profile Info */}
      <div className="flex items-center gap-3 px-4 py-4">
        <img
          src={user?.avatar || avatarPlaceholder}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      {/* 🎟 My Bookings */}
      <button
        onClick={() => {
          navigate("/my-bookings");
          onClose?.();
        }}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800 transition"
      >
        <Ticket size={18} />
        My Bookings
      </button>

      <div className="h-px bg-zinc-800" />

      {/* 🚪 Logout */}
      <button
        onClick={() => {
          logoutUser();
          onClose?.();
        }}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
