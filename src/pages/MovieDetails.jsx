import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import Toast from "../components/Toast";
import WatchlistButton from "../components/WatchlistButton";
import ReviewsTab from "../components/ReviewsTab";
import Row from "../components/Row";
import { AuthContext } from "../context/AuthContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/movies/details/${id}`);
        setDetails(res.data);
      } catch (err) {
        console.error("Load movie err", err);
        setToast({ show: true, message: "Failed to load movie" });
      }
    };
    load();
  }, [id]);
  const handleSelect = (item) => {
    const isTV = item.media_type === "tv" || item.first_air_date;
    if (isTV) navigate(`/series/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };
  const showToast = (message) => setToast({ show: true, message });

  if (!details) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-slate-400">Loading...</div>
      </div>
    );
  }

  const { title, overview, genres = [], poster_path, backdrop_path, vote_average, runtime, release_date } = details;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* HERO */}
      <div className="relative">
        <div className="h-[42vh] md:h-[48vh] bg-linear-to-t from-[#050816] to-transparent">
          <img src={backdrop_path ? `https://image.tmdb.org/t/p/original${backdrop_path}` : "/no-backdrop.png"} alt={title} className="w-full h-full object-cover opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20">
          <div className="flex gap-6">
            {/* Poster */}
            <div className="w-40 md:w-[220px] rounded overflow-hidden shadow-2xl">
              <img src={poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : "/no-poster.png"} alt={title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{title} <span className="text-sm text-slate-400">({release_date?.slice(0,4)})</span></h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-yellow-400 font-semibold">⭐ {vote_average?.toFixed(1)}</div>
                <div className="text-sm text-slate-400">• {genres.map(g => g.name).join(", ")}</div>
                <div className="text-sm text-slate-400">• {runtime ? `${runtime}m` : ""}</div>
              </div>

              <p className="mt-4 text-slate-200 max-w-2xl">{overview}</p>

              <div className="mt-6 flex items-center gap-3">
                <WatchlistButton
                  tmdbId={Number(id)}
                  mediaType="movie"
                  title={title}
                  poster={poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : ""}
                  onToast={showToast}
                />
                <button onClick={() => setActiveTab("reviews")} className="px-4 py-2 rounded-full border border-slate-700 text-[#F6E7C6]">Reviews</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-3">
            <button onClick={() => setActiveTab("overview")} className={`px-3 py-1 rounded ${activeTab==="overview" ? "bg-[#FF7A1A] text-black" : "bg-[#0B1120] text-[#F6E7C6]"}`}>Overview</button>
            <button onClick={() => setActiveTab("reviews")} className={`px-3 py-1 rounded ${activeTab==="reviews" ? "bg-[#FF7A1A] text-black" : "bg-[#0B1120] text-[#F6E7C6]"}`}>Reviews</button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Overview</h3>
            <p className="text-slate-300">{overview}</p>

            {/* Similar */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">More like this</h3>
              <Row title="" fetchUrl={`/movies/similar/${id}`} onSelect={handleSelect} />
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewsTab mediaType="movie" tmdbId={Number(id)} poster={poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : ""} title={title} onToast={showToast} />
        )}
      </div>

      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
};

export default MovieDetails;
