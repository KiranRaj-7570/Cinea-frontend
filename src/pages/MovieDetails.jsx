import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import Toast from "../components/Toast";
import WatchlistButton from "../components/WatchlistButton";
import ReviewsTab from "../components/ReviewsTab";
import Row from "../components/Row";
import { AuthContext } from "../context/AuthContext";
import MovieDetailsSkeleton from "../components/Skeletons/MovieDetailsSkeleton";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({ show: false, message: "" });

  const [inWatchlist, setInWatchlist] = useState(false);
  const [completed, setCompleted] = useState(false);

  const showToast = (message) =>
    setToast({ show: true, message });

  /* ================= LOAD MOVIE ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/movies/details/${id}`);
        setDetails(res.data);
      } catch (err) {
        console.error("Load movie err", err);
        showToast("Failed to load movie");
      }
    };
    load();
  }, [id]);

  /* ================= CHECK COMPLETED ================= */

  useEffect(() => {
    if (!user || !inWatchlist) {
      setCompleted(false);
      return;
    }

    const checkCompleted = async () => {
      try {
        const res = await api.get("/watchlist");
        const item = res.data.items?.find(
          (i) =>
            Number(i.tmdbId) === Number(id) &&
            i.mediaType === "movie"
        );
        setCompleted(Boolean(item?.completed));
      } catch (err) {
        console.error("Completed check error", err);
      }
    };

    checkCompleted();
  }, [user, inWatchlist, id]);

  if (!details) {
  return (
    <>
      <Navbar />
      <MovieDetailsSkeleton />
    </>
  );
  }
  const {
    title,
    overview,
    genres = [],
    poster_path,
    backdrop_path,
    vote_average,
    runtime,
    release_date,
  } = details;

  const handleSelect = (item) => {
    const isTV = item.media_type === "tv" || item.first_air_date;
    navigate(isTV ? `/series/${item.id}` : `/movie/${item.id}`);
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* HERO */}
      <div className="relative">
        <div className="h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[55vh] w-full overflow-hidden">
          <img
            src={
              backdrop_path
                ? `https://image.tmdb.org/t/p/original${backdrop_path}`
                : "/no-backdrop.png"
            }
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050816]" />
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-32 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Poster */}
              <div className="w-32 sm:w-40 md:w-48 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-[#FF7A1A]/20">
                <img
                  src={
                    poster_path
                      ? `https://image.tmdb.org/t/p/w342${poster_path}`
                      : "/no-poster.png"
                  }
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-end pb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                  {title}{" "}
                  <span className="text-sm sm:text-base text-slate-400 font-normal">
                    ({release_date?.slice(0, 4)})
                  </span>
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 mb-4">
                  <span className="text-yellow-400 font-semibold flex items-center gap-1">
                    ⭐ {vote_average?.toFixed(1)}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="line-clamp-2">
                    {genres.map((g) => g.name).join(", ")}
                  </span>
                  {runtime && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>{runtime}m</span>
                    </>
                  )}
                </div>

                <p className="text-sm sm:text-base text-slate-300 line-clamp-3 mb-4">
                  {overview}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <WatchlistButton
                    tmdbId={Number(id)}
                    mediaType="movie"
                    title={title}
                    poster={
                      poster_path
                        ? `https://image.tmdb.org/t/p/w342${poster_path}`
                        : ""
                    }
                    onToast={showToast}
                    onChange={setInWatchlist}
                  />

                  {inWatchlist && (
                    <button
                      disabled={completed}
                      onClick={async () => {
                        try {
                          await api.patch(
                            `/watchlist/movie/${id}/complete`
                          );
                          setCompleted(true);
                          showToast("Marked as completed 🎉");
                        } catch {
                          showToast("Failed to mark completed");
                        }
                      }}
                      className={`
                        px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base
                        ${
                          completed
                            ? "bg-green-500/20 text-green-400 border border-green-500 cursor-not-allowed"
                            : "bg-[#FF7A1A]/10 border border-[#FF7A1A] text-[#FF7A1A] hover:bg-[#FF7A1A] hover:text-black"
                        }
                      `}
                    >
                      {completed ? "✓ Completed" : "Mark as Completed"}
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="px-3 sm:px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-[#FF7A1A] hover:text-[#FF7A1A] transition text-sm sm:text-base"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 sm:gap-3 mb-6 border-b border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 sm:px-4 py-2 sm:py-3 rounded-t-lg font-semibold transition text-sm sm:text-base ${
                activeTab === "overview"
                  ? "bg-[#FF7A1A] text-black border-b-2 border-[#FF7A1A]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-3 sm:px-4 py-2 sm:py-3 rounded-t-lg font-semibold transition text-sm sm:text-base ${
                activeTab === "reviews"
                  ? "bg-[#FF7A1A] text-black border-b-2 border-[#FF7A1A]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="animate-fadeIn">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 md:mb-12">
                {overview}
              </p>

              <div className="mt-8 md:mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  More like this
                </h3>
                <Row
                  title=""
                  fetchUrl={`/movies/similar/${id}`}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-fadeIn">
              <ReviewsTab
                mediaType="movie"
                tmdbId={Number(id)}
                poster={
                  poster_path
                    ? `https://image.tmdb.org/t/p/w342${poster_path}`
                    : ""
                }
                title={title}
                onToast={showToast}
              />
            </div>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default MovieDetails;
