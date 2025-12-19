import { useState, useEffect, useContext, useRef } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { fetchWatchlistItem } from "../utils/watchlistSync";

const WatchlistButton = ({
  tmdbId,
  mediaType,
  title,
  poster,
  onToast = () => {},
  onChange = () => {},
  refreshKey = 0,
}) => {
  const { user } = useContext(AuthContext);

  const [state, setState] = useState({
    inList: false,
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const prevRef = useRef(state);

  /* ===== SYNC FROM WATCHLIST ===== */
  const sync = async () => {
    if (!user) {
      setState({ inList: false, completed: false });
      return;
    }
    try {
      const item = await fetchWatchlistItem(tmdbId, mediaType);
      setState({
        inList: Boolean(item),
        completed: Boolean(item?.completed),
      });
    } catch (e) {
      console.error("Watchlist sync failed", e);
    }
  };

  useEffect(() => {
    sync();
  }, [tmdbId, mediaType, user, refreshKey]);

  /* notify parent ONLY on change */
  useEffect(() => {
    if (
      prevRef.current.inList !== state.inList ||
      prevRef.current.completed !== state.completed
    ) {
      prevRef.current = state;
      onChange(state.inList);
    }
  }, [state, onChange]);

  /* ===== ACTIONS ===== */

  const add = async () => {
    if (!user) return onToast("Login required");
    setLoading(true);

    try {
      await api.post("/watchlist", { tmdbId, mediaType, title, poster });

      /* 🔥 OPTIMISTIC UPDATE (SAFE) */
      setState((s) => ({ ...s, inList: true }));
      onChange(true);

      await sync(); // backend truth
      onToast("Added to watchlist");
    } catch (e) {
      onToast("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.delete(`/watchlist/${mediaType}/${tmdbId}`);
      setState((s) => ({ ...s, inList: false }));
      onChange(false);

      await sync();
      onToast("Removed from watchlist");
    } catch {
      onToast("Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  /* ===== UX RULE ===== */
  if (state.completed) return null;

  return !state.inList ? (
    <button
      onClick={add}
      disabled={loading}
      className="px-4 py-2 rounded-full bg-[#FF7A1A] text-black font-semibold"
    >
      {loading ? "updating..." : "+ Add to Watchlist"}
    </button>
  ) : (
    <button
      onClick={remove}
      disabled={loading}
      className="px-4 py-2 rounded-full bg-[#0F3E21] border border-green-500 text-green-300 font-semibold"
    >
      {loading ? "updating..." : "✓ In Watchlist"}
    </button>
  );
};

export default WatchlistButton;
