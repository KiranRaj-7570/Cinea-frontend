import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { AuthContext } from "../context/AuthContext";

const TABS = [
  { key: "watchlist", label: "Watchlist" },
  { key: "continue", label: "Continue Watching" },
  { key: "completed", label: "Completed" },
];

const TAB_STORAGE_KEY = "cinea_watchlist_active_tab";

const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem(TAB_STORAGE_KEY) || "watchlist"
  );
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => setToast({ show: true, message: msg });

  useEffect(() => {
    load();
  }, []);

  // 🔒 persist tab (UX fix)
  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/watchlist");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Watchlist load error", err);
      showToast("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (tmdbId, mediaType) => {
    try {
      await api.delete(`/watchlist/${mediaType}/${tmdbId}`);
      setItems((prev) =>
        prev.filter((i) => !(i.tmdbId === tmdbId && i.mediaType === mediaType))
      );
      showToast("Removed from watchlist");
    } catch {
      showToast("Failed to remove");
    }
  };

  const filteredItems = items.filter((i) => i.status === activeTab);

  const handleNavigate = (item) => {
    if (item.mediaType === "tv") navigate(`/series/${item.tmdbId}`);
    else navigate(`/movie/${item.tmdbId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 pb-16">
        {/* ===== HEADER ===== */}
        <div className="mb-5">
          <h1 className="text-4xl font-bold text-[#F6E7C6] anton mt-2 mb-2">
            Your Watchlist
          </h1>

          <p className="text-[#F6E7C6] mt-1 text-xl [word-spacing:0.2rem] reem-kufi">
            Movies & series you care about, all in one place
          </p>

          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5" />
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-6 border-b border-black/20 mb-10 poppins-regular">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-md font-semibold transition ${
                activeTab === tab.key
                  ? "text-[#FF7A1A]"
                  : "text-[#F6E7C6] hover:text-slate-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute left-0 -bottom-px h-0.5 w-full bg-[#FF7A1A]" />
              )}
            </button>
          ))}
        </div>

        {/* ===== CONTENT ===== */}
        {loading ? (
          // ===== SKELETON LOADER =====
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-xl overflow-hidden bg-[#181818] border border-slate-800 animate-pulse"
              >
                <div className="w-full h-[220px] md:h-[300px] bg-slate-700/40" />
                <div className="px-3 py-3 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-600/40 rounded" />
                  <div className="h-3 w-1/2 bg-slate-600/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-slate-400">Nothing here yet 🎬</p>
            <p className="text-sm text-slate-500 mt-2">
              Start exploring movies and series to build your watchlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((item) => {
              const poster = item.poster || item.backdrop || "/no-poster.png";

              return (
                <div
                  key={`${item.mediaType}-${item.tmdbId}`}
                  onClick={() => handleNavigate(item)}
                  className="group relative cursor-pointer w-full reem-kufi"
                >
                  {/* REMOVE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.tmdbId, item.mediaType);
                    }}
                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full
                               bg-black/60 hover:bg-black/80 text-white
                               flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>

                  {/* CARD */}
                  <div
                    className="w-full rounded-xl overflow-hidden
                               bg-[#181818]
                               border border-slate-800
                               group-hover:border-[#FF7A1A]/60
                               group-hover:shadow-[0_0_20px_-8px_rgba(255,122,26,0.4)]
                               transition"
                  >
                    {/* POSTER */}
                    <div className="relative">
                      <img
                        src={poster}
                        alt={item.title}
                        className="w-full h-[220px] md:h-[300px] object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    {/* INFO */}
                    <div className="px-3 py-2">
                      <p className="text-xl text-[#F6E7C6] font-semibold truncate">
                        {item.title}
                      </p>

                      <p className="text-[14px] text-gray-400 capitalize">
                        {item.mediaType}
                      </p>

                      {activeTab === "continue" &&
                        item.mediaType === "tv" &&
                        item.progress?.lastWatched && (
                          <p className="mt-0.5 text-[12px] text-[#FF7A1A] leading-tight">
                            S{item.progress.lastWatched.season} · Ep{" "}
                            {item.progress.lastWatched.episode}
                          </p>
                        )}

                      {activeTab === "completed" && (
                        <span className="inline-block mt-0.5 text-[12px] px-2 py-0.5 rounded-full
                                         bg-green-500/10 text-green-400">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default Watchlist;
