import { NavLink } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const AdminSidebar = ({ onNavigate = () => {} }) => {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-[#1a1a1a] transition";
  const activeLinkClass = "bg-[#FF7A1A]/10 text-[#FF7A1A] border-l-2 border-[#FF7A1A]";

  const handleNavClick = () => {
    onNavigate();
  };

  return (
    <aside className="w-full h-full bg-[#0f0f0f] border-r border-white/10 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-8 text-[#FF7A1A]">Cinéa Admin</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-slate-500 px-4 uppercase tracking-wider">Theatres & Shows</p>
        </div>

        <NavLink
          to="/admin/theatres/add"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          Add Theatre
        </NavLink>

        <NavLink
          to="/admin/theatres"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          Manage Theatres
        </NavLink>

        <NavLink
          to="/admin/shows/add"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          Add Show
        </NavLink>

        <NavLink
          to="/admin/shows"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          Manage Shows
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-slate-500 px-4 uppercase tracking-wider">Moderation</p>
        </div>

        <NavLink
          to="/admin/reviews/reports"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : ""} flex items-center gap-2`
          }
        >
          <AlertTriangle size={16} />
          Review Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
