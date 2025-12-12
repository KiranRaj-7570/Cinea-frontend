import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { AuthContext } from "../context/AuthContext";

const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [progressMap, setProgressMap] = useState({}); // tmdbId → progress

  const showToast = (msg) => setToast({ show: true, message: msg });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/watchlist");
      const list = res.data.items || [];
      setItems(list);

      // Load series progress for each tv item
      const map = {};
      for (const it of list) {
        if (it.mediaType === "tv") {
          try {
            const p = await api.get(`/progress/tv/${it.tmdbId}`);
            map[it.tmdbId] = p.data.progress || null;
          } catch {}
        }
      }
      setProgressMap(map);

    } catch (err) {
      console.error("Watchlist load error", err);
      showToast("Failed loading watchlist");
    }
  };

  const remove = async (tmdbId, mediaType) => {
    try {
      await api.delete(`/watchlist/${mediaType}/${tmdbId}`);
      setItems((prev) => prev.filter((i) => !(i.tmdbId === tmdbId && i.mediaType === mediaType)));
      showToast("Removed from watchlist");
    } catch (err) {
      console.error("Remove err", err);
      showToast("Failed to remove");
    }
  };

  const handleNavigate = (item) => {
    if (item.mediaType === "tv") navigate(`/series/${item.tmdbId}`);
    else navigate(`/movie/${item.tmdbId}`);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <h1 className="text-3xl font-bold mb-6 text-[#F6E7C6]">Your Watchlist</h1>

        {items.length === 0 ? (
          <p className="text-slate-400 text-lg">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const progress = progressMap[item.tmdbId];
              const hasProgress = progress && progress.lastWatched;

              const isTV = item.mediaType === "tv";
              const poster = item.poster || item.backdrop || "/no-poster.png";

              return (
                <div
                  key={`${item.mediaType}-${item.tmdbId}`}
                  className="relative group cursor-pointer"
                  onClick={() => handleNavigate(item)}
                >
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.tmdbId, item.mediaType);
                    }}
                    className="absolute top-2 right-2 z-30 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>

                  {/* Card */}
                  <div
                    className="
                      rounded-xl overflow-hidden border border-slate-800
                      bg-[#181818] shadow-lg
                      group-hover:border-[#FF7A1A] transition-all duration-300
                    "
                  >
                    <img
                      src={poster}
                      alt={item.title}
                      className={`
                        w-full object-cover 
                        ${isTV ? "h-[150px] md:h-[190px]" : "h-[220px] md:h-[260px]"}
                      `}
                    />

                    <div className="p-3">
                      <p className="text-[#F6E7C6] font-semibold truncate">
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-400 capitalize">
                        {item.mediaType}
                      </p>

                      {/* Series progress */}
                      {isTV && hasProgress && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-300 mb-1">
                            Continue S{progress.lastWatched.season} • Ep {progress.lastWatched.episode}
                          </p>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FF7A1A]"
                              style={{
                                width:
                                  (progress.lastWatched.episode /
                                    (progress.seasons?.find(
                                      (s) => s.seasonNumber === progress.lastWatched.season
                                    )?.totalEpisodes || 1)) *
                                    100 +
                                  "%",
                              }}
                            />
                          </div>
                        </div>
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
