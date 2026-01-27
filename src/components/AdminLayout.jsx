import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white">
      {/* MOBILE SIDEBAR TOGGLE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-4 z-50 lg:hidden p-2 rounded transition text-[#F6E7C6] ${
          sidebarOpen ? "left-64 bg-[#0f0f0f]" : "left-6 hover:bg-[#1a1a1a]"
        }`}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR - FIXED HEIGHT */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-[#0f0f0f] border-r border-white/10 z-40 transition-transform duration-300 lg:translate-x-0 overflow-hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT - SCROLLABLE ONLY THIS */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;