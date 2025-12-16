import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-[#1a1a1a]";

  return (
    <aside className="w-64 bg-[#0f0f0f] border-r border-white/10 p-4">
      <h2 className="text-xl font-bold mb-6">Cinéa Admin</h2>

      <nav className="space-y-2">
        <NavLink to="/admin" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/theatres/add" className={linkClass}>
          Add Theatre
        </NavLink>

        <NavLink to="/admin/theatres" className={linkClass}>
          Manage Theatres
        </NavLink>

        <NavLink to="/admin/shows/add" className={linkClass}>
          Add Show
        </NavLink>

        <NavLink to="/admin/shows" className={linkClass}>
          Manage Shows
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
