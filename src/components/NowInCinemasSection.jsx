import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "./Skeletons/SectionSkeleton";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const NowInCinemasSection = () => {
  const [items, setItems] = useState([]);
  const [watchlistMap, setWatchlistMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadWatchlistState = async () => {
      try {
        const res = await api.get("/watchlist");
        const map = {};
        (res.data.items || []).forEach((w) => {
          map[w.tmdbId] = true;
        });
        mounted && setWatchlistMap(map);
      } catch {
        // silent fail
      }
    };

    const loadMovies = async () => {
      try {
        setLoading(true);

        await loadWatchlistState();

        const res = await api.get("/book/movies");
        mounted && setItems((res.data || []).slice(0, 6));
      } catch (err) {
        console.error("Now in cinemas failed", err);
        mounted && setItems([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    loadMovies();
    return () => {
      mounted = false;
    };
  }, []);

  const handleBookNow = async (movieId) => {
    try {
      const res = await api.get(`/home/shows/movie/${movieId}/first-city`);

      const city = res.data.city || localStorage.getItem("city") || "Kollam";

      navigate(`/book/${movieId}?city=${city}`);
    } catch {
      navigate(`/book/${movieId}`);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
          Now in Cinemas
        </h2>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
        <SectionSkeleton />
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Now in Cinemas
      </h2>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
        {items.map((m) => {
          const inWatchlist = watchlistMap[m.movieId] === true;

          return (
            <div
              key={m.movieId}
              className="w-[180px] sm:min-w-[220px] bg-[#F6E7C6] border border-white/10 rounded-2xl overflow-hidden shrink-0 hover:border-[#FF7A1A]/40 transition"
            >
              <div className="relative">
                <img
                  draggable={false}
                  src={
                    m.poster
                      ? `${TMDB_IMG}${m.poster}`
                      : "/poster-placeholder.png"
                  }
                  alt={m.title}
                  onClick={() => navigate(`/movie/${m.movieId}`)}
                  className="w-full h-[220px] sm:h-[280px] object-cover cursor-pointer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="p-3 flex flex-col gap-2">
                <h3
                  onClick={() => navigate(`/movie/${m.movieId}`)}
                  className="text-xl md:text-2xl anton text-[#222222] line-clamp-2 cursor-pointer"
                >
                  {m.title}
                </h3>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleBookNow(m.movieId)}
                    className="flex-1 py-1.5 rounded-full bg-[#FF7A1A] text-black text-xs sm:text-sm reem-kufi hover:bg-orange-600 transition"
                  >
                    Book Now
                  </button>

                  <button
                    onClick={async () => {
                      const prev = inWatchlist;

                      setWatchlistMap((p) => ({
                        ...p,
                        [m.movieId]: !prev,
                      }));

                      try {
                        await api.post("/watchlist", {
                          tmdbId: m.movieId,
                          mediaType: "movie",
                          title: m.title,
                          poster: m.poster?.startsWith("http")
                            ? m.poster
                            : `https://image.tmdb.org/t/p/w500${m.poster}`,
                        });
                      } catch {
                        setWatchlistMap((p) => ({
                          ...p,
                          [m.movieId]: prev,
                        }));
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-full text-xs sm:text-sm reem-kufi transition
                      ${
                        inWatchlist
                          ? "bg-[#1c1c1c] border border-[#FF7A1A]/60 text-[#FF7A1A]"
                          : "bg-[#1c1c1c] border border-white/10 text-[#F6E7C6]"
                      }`}
                  >
                    {inWatchlist ? "In Watchlist" : "+ Watchlist"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NowInCinemasSection;
