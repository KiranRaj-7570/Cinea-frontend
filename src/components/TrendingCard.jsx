import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { StarIcon } from "lucide-react";

const TrendingCard = ({ item, inWatchlist, onToggleWatchlist }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [localInWatchlist, setLocalInWatchlist] = useState(inWatchlist);

  // Sync when parent updates
  useEffect(() => {
    setLocalInWatchlist(inWatchlist);
  }, [inWatchlist]);

  const goToDetails = () => {
    navigate(
      item.mediaType === "movie"
        ? `/movie/${item.tmdbId}`
        : `/series/${item.tmdbId}`
    );
  };

  const toggleWatchlist = async () => {
    if (loading) return;

    const prev = localInWatchlist;
    const next = !prev;

    // Optimistic UI
    setLocalInWatchlist(next);

    try {
      setLoading(true);
      await api.post("/watchlist", {
        tmdbId: item.tmdbId,
        mediaType: item.mediaType,
        title: item.title,
        poster: item.poster,
      });

      // 🔥 update parent state
      onToggleWatchlist(item.tmdbId, next);
    } catch {
      setLocalInWatchlist(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[380px] h-[220px] md:w-[610px] md:h-[280px] bg-[#F6E7C6] border border-white/10 rounded-2xl p-4 flex gap-4">
      {/* IMAGE */}
      <img
        draggable={false}
        src={item.poster}
        alt={item.title}
        onClick={goToDetails}
        className="w-[140px] h-full rounded-xl object-cover cursor-pointer bg-black"
      />

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3
            onClick={goToDetails}
            className="text-xl md:text-3xl anton text-[#222222] cursor-pointer line-clamp-1"
          >
            {item.title}
          </h3>

          <p className="text-sm md:text-2xl text-black mt-1 antonio">
            <StarIcon
              className="inline mr-1 mb-1"
              size={14}
              color="#ff8636"
              fill="#ff8636"
            />{" "}
            {typeof item.rating === "number"
              ? item.rating.toFixed(1)
              : "—"}
          </p>

          <p className="text-xs md:text-sm poppins-regular text-[#222222] mt-3 line-clamp-5 md:line-clamp-6">
            {item.overview || "No description available."}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={toggleWatchlist}
            disabled={loading}
            className={`px-4 py-1.5 rounded-full text-sm reem-kufi transition
              ${
                localInWatchlist
                  ? "bg-[#333] text-[#F6E7C6]"
                  : "bg-[#FF7A1A] text-black hover:bg-[#ff6f08]"
              }`}
          >
            {localInWatchlist ? "In Watchlist" : "+ Watchlist"}
          </button>

          <button
            onClick={goToDetails}
            className="px-4 py-1.5 rounded-full bg-[#222] text-sm reem-kufi text-[#F6E7C6]"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
