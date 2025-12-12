import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const WatchlistButton = ({
  tmdbId,
  mediaType,
  title,
  poster,
  onToast = () => {},
  onChange = () => {},
  forceInList = null,
}) => {
  const { user } = useContext(AuthContext);
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (forceInList === true) {
      setInList(true);
    } else if (forceInList === false) {
      setInList(false);
    }
  }, [forceInList]);

 
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!user) {
        if (mounted) setInList(false);
        return;
      }
      try {
        const res = await api.get("/watchlist");
        const items = res.data.items || [];
        const found = items.some(
          (it) =>
            Number(it.tmdbId) === Number(tmdbId) &&
            (it.mediaType || it.media_type) === mediaType
        );
        if (mounted) setInList(Boolean(found));
      } catch (err) {
        console.error("Watchlist check error:", err);
      }
    };
    check();
    return () => (mounted = false);
  }, [tmdbId, mediaType, user]);

  useEffect(() => {
    onChange(inList);
  }, [inList, onChange]);

  const add = async () => {
    if (!user) return onToast("Login to add to watchlist");
    setLoading(true);
    try {
      const res = await api.post("/watchlist", {
        tmdbId,
        mediaType,
        title,
        poster,
      });
      setInList(true);
      onToast(res.data?.message || "Added to watchlist");
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!user) return onToast("Login to remove");
    setLoading(true);
    try {
      const res = await api.delete(`/watchlist/${mediaType}/${tmdbId}`);
      setInList(false);
      onToast(res.data?.message || "Removed from watchlist");
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!inList ? (
        <button
          onClick={add}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-[#FF7A1A] hover:bg-[#f56c08] text-black font-semibold"
        >
          {loading ? "..." : "+ Add to Watchlist"}
        </button>
      ) : (
        <button
          onClick={remove}
          disabled={loading}
          className="px-3 py-2 rounded-full bg-[#0F3E21] border border-green-500 text-green-300 font-semibold"
        >
          {loading ? "..." : "✓ In Watchlist"}
        </button>
      )}
    </div>
  );
};

export default WatchlistButton;
