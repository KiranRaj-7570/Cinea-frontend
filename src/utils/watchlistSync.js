import api from "../api/axios";

export const fetchWatchlistItem = async (tmdbId, mediaType) => {
  const res = await api.get("/watchlist");
  return res.data.items?.find(
    (i) => Number(i.tmdbId) === Number(tmdbId) && i.mediaType === mediaType
  ) || null;
};
