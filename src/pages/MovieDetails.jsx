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
import ConfirmModal from "../components/ConfirmModal";
import GoBackButton from "../components/GoBackButton";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const showToast = (message) => setToast({ show: true, message });

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

  useEffect(() => {
    if (!user || !inWatchlist) {
      setCompleted(false);
      return;
    }

    const checkCompleted = async () => {
      try {
        const res = await api.get("/watchlist");
        const item = res.data.items?.find(
          (i) => Number(i.tmdbId) === Number(id) && i.mediaType === "movie"
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

  const markCompleted = async () => {
    if (!user) return showToast("Login required");
    setLoadingComplete(true);
    try {
      await api.post(`/watchlist/movie/${id}/complete`);
      setCompleted(true);
      setWatchlistRefreshKey((k) => k + 1);
      showToast("Marked as completed 🎉");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to mark completed");
    } finally {
      setLoadingComplete(false);
      setConfirmOpen(false);
    }
  };

  const unmarkCompleted = async () => {
    setLoadingComplete(true);
    try {
      await api.post(`/watchlist/movie/${id}/uncomplete`);
      setCompleted(false);
      setWatchlistRefreshKey((k) => k + 1);
      showToast("Unmarked ✓");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to unmark");
    } finally {
      setLoadingComplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white">
   

      {/* HERO */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-20">
          <GoBackButton label="Back" />
        </div>
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
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#161616]" />
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
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 anton text-[#F6E7C6]">
                  {title}{" "}
                  <span className="text-sm text-orange-400 font-normal">
                    ({release_date?.slice(0, 4)})
                  </span>
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#F6E7C6] mb-4">
                  <span className="text-yellow-400 font-semibold">
                    ⭐ {vote_average?.toFixed(1)}
                  </span>
                  <span>{genres.map((g) => g.name).join(", ")}</span>
                  {runtime && <span>{runtime}m</span>}
                </div>

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
                    refreshKey={watchlistRefreshKey} // 🔥 NEW
                  />

                  {inWatchlist && !completed && (
                    <button
                      onClick={() => setConfirmOpen(true)}
                      className="px-3 sm:px-4 py-2 rounded-lg border border-[#FF7A1A] text-[#FF7A1A] hover:bg-[#FF7A1A] hover:text-black font-semibold"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {completed && (
                    <button
                      onClick={unmarkCompleted}
                      disabled={loadingComplete}
                      className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500/30 font-semibold"
                    >
                      ✓ Completed
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="px-3 sm:px-4 py-2 rounded-lg border border-[#F6E7C6] text-[#F6E7C6] hover:border-[#FF7A1A] hover:text-[#FF7A1A]"
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 mb-6 border-b border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 ${
                activeTab === "overview"
                  ? "bg-[#FF7A1A] text-black"
                  : "text-[#F6E7C6]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 ${
                activeTab === "reviews"
                  ? "bg-[#FF7A1A] text-black"
                  : "text-[#F6E7C6]"
              }`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "overview" && (
            <>
              <p className="text-[#F6E7C6] mb-10">{overview}</p>
              <Row
                title="More like this"
                fetchUrl={`/movies/similar/${id}`}
                onSelect={handleSelect}
              />
            </>
          )}

          {activeTab === "reviews" && (
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
              onCompleted={() => {
                setCompleted(true);
                setWatchlistRefreshKey((k) => k + 1);
              }}
              onWatchlistChange={setInWatchlist}
            />
          )}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Mark movie as completed?"
        description="This will mark the movie as watched."
        confirmText="Mark Completed"
        confirmVariant="primary"
        loading={loadingComplete}
        onConfirm={markCompleted}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default MovieDetails;
