import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import Toast from "../components/Toast";
import WatchlistButton from "../components/WatchlistButton";
import MarkSeriesCompletedButton from "../components/MarkSeriesCompletedButton";
import EpisodesTab from "../components/EpisodesTab";
import ReviewsTab from "../components/ReviewsTab";
import Row from "../components/Row";
import { AuthContext } from "../context/AuthContext";
import TvDetailsSkeleton from "../components/Skeletons/TvDetailsSkeleton";

const TvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

  const [inWatchlist, setInWatchlist] = useState(false);
  const [completed, setCompleted] = useState(false);

  const showToast = (message) => setToast({ show: true, message });

  /* ================= LOAD DETAILS ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/tvshows/details/${id}`);
        setDetails(res.data);
      } catch {
        showToast("Failed to load show");
      }
    };
    load();
  }, [id]);

  /* ================= SYNC COMPLETED ================= */
  useEffect(() => {
    if (!user || !inWatchlist) {
      setCompleted(false);
      return;
    }

    const sync = async () => {
      try {
        const res = await api.get("/watchlist");
        const item = res.data.items?.find(
          (i) => i.tmdbId === Number(id) && i.mediaType === "tv"
        );
        setCompleted(Boolean(item?.completed));
      } catch {}
    };

    sync();
  }, [user, inWatchlist, id]);

  if (!details) {
    return (
      <>
        <Navbar />
        <TvDetailsSkeleton />
      </>
    );
  }

  const {
    name,
    overview,
    genres = [],
    poster_path,
    backdrop_path,
    seasons = [],
    vote_average,
  } = details;

  const handleSelect = (item) => {
    const isTV = item.media_type === "tv" || item.first_air_date;
    navigate(isTV ? `/series/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="relative">
        <div className="h-[35vh] md:h-[50vh] w-full overflow-hidden">
          <img
            src={
              backdrop_path
                ? `https://image.tmdb.org/t/p/original${backdrop_path}`
                : "/no-backdrop.png"
            }
            alt={name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#161616]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-24 flex gap-6">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w342${poster_path}`
                : "/no-poster.png"
            }
            className="w-40 rounded-lg shadow-lg"
            alt={name}
          />

          <div className="flex-1 md:mt-30 ">
            <h1 className="text-3xl font-bold anton text-[#F6E7C6]">{name}</h1>
            <div className="flex gap-3 text-sm text-[#F6E7C6] mt-2">
              <span className="text-yellow-400">
                ⭐ {vote_average?.toFixed(1)}
              </span>
              <span>{genres.map((g) => g.name).join(", ")}</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex flex-wrap gap-3">
              <WatchlistButton
                tmdbId={Number(id)}
                mediaType="tv"
                title={name}
                poster={
                  poster_path
                    ? `https://image.tmdb.org/t/p/w342${poster_path}`
                    : ""
                }
                onChange={setInWatchlist}
                onToast={showToast}
                refreshKey={watchlistRefreshKey}
              />

              <MarkSeriesCompletedButton
                tmdbId={Number(id)}
                inWatchlist={inWatchlist}
                completed={completed}
                onCompletedChange={(val) => {
                  setCompleted(val);
                  setWatchlistRefreshKey((k) => k + 1);
                }}
                onToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-3 border-b border-slate-700 mb-6">
          {["overview", "episodes", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-[#FF7A1A] text-[#FF7A1A]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <p className="text-[#F6E7C6] mb-8">{overview}</p>

            <Row
              title="More like this"
              fetchUrl={`/tvshows/similar/${id}`}
              onSelect={handleSelect}
            />
          </>
        )}

        {activeTab === "episodes" && (
          <EpisodesTab
            tmdbId={Number(id)}
            seasons={seasons}
            title={name}
            poster={
              poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : ""
            }
            onToast={showToast}
            inWatchlist={inWatchlist}
            completed={completed}
            onWatchlistChange={setInWatchlist}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab
            mediaType="tv"
            tmdbId={Number(id)}
            poster={
              poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : ""
            }
            title={name}
            onToast={showToast}
            onCompleted={() => {
              setCompleted(true);
              setWatchlistRefreshKey((k) => k + 1);
            }}
            onWatchlistChange={setInWatchlist}
          />
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default TvDetails;
