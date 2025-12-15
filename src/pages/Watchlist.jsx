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

const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("watchlist");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => setToast({ show: true, message: msg });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/watchlist");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Watchlist load error", err);
      showToast("Failed to load watchlist");
    }
  };

  const remove = async (tmdbId, mediaType) => {
    try {
      await api.delete(`/watchlist/${mediaType}/${tmdbId}`);
      setItems((prev) =>
        prev.filter(
          (i) => !(i.tmdbId === tmdbId && i.mediaType === mediaType)
        )
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
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <h1 className="text-3xl font-bold mb-6 text-[#F6E7C6]">
          Your Watchlist
        </h1>

        {/* ===== TABS ===== */}
        <div className="relative mb-8">
          <div className="flex gap-8 border-b border-slate-800">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "text-[#FF7A1A]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SLIDER */}
          <div
            className="absolute bottom-0 h-[2px] bg-[#FF7A1A] transition-all duration-300"
            style={{
              width: "120px",
              left:
                activeTab === "watchlist"
                  ? "0px"
                  : activeTab === "continue"
                  ? "140px"
                  : "340px",
            }}
          />
        </div>

        {/* ===== CONTENT ===== */}
        {filteredItems.length === 0 ? (
          <p className="text-slate-400 text-lg">
            Nothing here yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const poster =
                item.poster || item.backdrop || "/no-poster.png";

              return (
                <div
                  key={`${item.mediaType}-${item.tmdbId}`}
                  className="relative group cursor-pointer"
                  onClick={() => handleNavigate(item)}
                >
                  {/* REMOVE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.tmdbId, item.mediaType);
                    }}
                    className="absolute top-2 right-2 z-30 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#181818] hover:border-[#FF7A1A] transition">
                    <img
                      src={poster}
                      alt={item.title}
                      className="w-full h-[220px] object-cover"
                    />

                    <div className="p-3">
                      <p className="text-[#F6E7C6] font-semibold truncate">
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-400 capitalize">
                        {item.mediaType}
                      </p>

                      {/* CONTINUE WATCHING INFO */}
                      {activeTab === "continue" &&
                        item.mediaType === "tv" &&
                        item.progress?.lastWatched && (
                          <p className="mt-2 text-xs text-[#FF7A1A]">
                            Continue S{item.progress.lastWatched.season} • Ep{" "}
                            {item.progress.lastWatched.episode}
                          </p>
                        )}

                      {/* COMPLETED BADGE */}
                      {activeTab === "completed" && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
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
