import { useEffect, useState, useContext, useRef, useMemo } from "react";
import api from "../api/axios";
import EpisodeItem from "./EpisodeItem";
import { AuthContext } from "../context/AuthContext";

const EpisodesTab = ({
  tmdbId,
  seasons = [],
  title,
  poster,
  inWatchlist,
  completed,
  onWatchlistChange = () => {},
  onToast = () => {},
}) => {
  const { user } = useContext(AuthContext);

  const visibleSeasons = useMemo(
    () => (seasons || []).filter((s) => s.season_number !== 0),
    [seasons]
  );

  const defaultSeason =
    visibleSeasons[0]?.season_number ??
    seasons?.[0]?.season_number ??
    1;

  const [activeSeason, setActiveSeason] = useState(defaultSeason);
  const [seasonDetails, setSeasonDetails] = useState({});
  const [progress, setProgress] = useState({
    seasons: [],
    lastWatched: { season: 0, episode: 0 },
  });
  const [loadingEp, setLoadingEp] = useState(false);

  const isMounted = useRef(true);
  const autoMarkedRef = useRef(false); // 🔒 prevent loops

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  /* ================= LOAD PROGRESS ================= */

  const loadProgress = async () => {
    try {
      const res = await api.get(`/progress/tv/${tmdbId}`);
      setProgress(
        res.data.progress || {
          seasons: [],
          lastWatched: { season: 0, episode: 0 },
        }
      );
    } catch (err) {
      console.error("Load progress error", err);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [tmdbId]);

  useEffect(() => {
    if (inWatchlist) loadProgress();
  }, [inWatchlist, tmdbId]);

  /* ================= FETCH SEASON ================= */

  const fetchSeasonDetails = async (seasonNumber) => {
    if (seasonDetails[seasonNumber]) {
      return seasonDetails[seasonNumber];
    }

    setLoadingEp(true);
    try {
      const res = await api.get(
        `/tvshows/${tmdbId}/season/${seasonNumber}`
      );

      if (!isMounted.current) return null;

      setSeasonDetails((prev) => ({
        ...prev,
        [seasonNumber]: res.data,
      }));

      return res.data; // ✅ RETURN DATA
    } catch (err) {
      console.error(err);
      onToast("Failed to load episodes");
      return null;
    } finally {
      setLoadingEp(false);
    }
  };

  useEffect(() => {
    if (activeSeason != null) {
      fetchSeasonDetails(activeSeason);
    }
  }, [activeSeason]);

  /* ================= AUTO MARK ALL WHEN COMPLETED ================= */

  useEffect(() => {
    if (!completed || autoMarkedRef.current || !visibleSeasons.length) return;

    const markAll = async () => {
      try {
        for (const s of visibleSeasons) {
          const data = await fetchSeasonDetails(s.season_number);
          const total = data?.episodes?.length || 0;

          if (total > 0) {
            await api.patch("/progress/mark-season", {
              tmdbId,
              season: s.season_number,
              totalEpisodesForSeason: total,
            });
          }
        }
        await loadProgress();
        autoMarkedRef.current = true; // 🔒 run only once
      } catch (err) {
        console.error("Auto mark all failed", err);
      }
    };

    markAll();
  }, [completed, visibleSeasons, tmdbId]);

  /* ================= HELPERS ================= */

  const isEpisodeWatched = (seasonNumber, episodeNumber) => {
    const s = progress.seasons?.find(
      (x) => x.seasonNumber === Number(seasonNumber)
    );
    return Boolean(s?.watchedEpisodes?.includes(Number(episodeNumber)));
  };

  /* ================= TOGGLE EP ================= */

  const handleToggle = async (seasonNumber, episodeNumber) => {
    if (!user) return onToast("Login to track progress");

    const seasonNum = Number(seasonNumber);
    const epNum = Number(episodeNumber);

    const seasonData = await fetchSeasonDetails(seasonNum);
    const total = seasonData?.episodes?.length || 0;

    // optimistic update
    setProgress((prev) => {
      const seasonsCopy = [...(prev.seasons || [])];
      let season = seasonsCopy.find(
        (s) => s.seasonNumber === seasonNum
      );

      if (!season) {
        season = { seasonNumber: seasonNum, watchedEpisodes: [] };
        seasonsCopy.push(season);
      }

      const watched = new Set(season.watchedEpisodes || []);
      const maxWatched = Math.max(0, ...watched);

      if (!watched.has(epNum)) {
        for (let i = 1; i <= epNum; i++) watched.add(i);
      } else if (epNum === maxWatched) {
        watched.delete(epNum);
      } else {
        for (let i = epNum + 1; i <= maxWatched; i++) watched.delete(i);
      }

      season.watchedEpisodes = Array.from(watched);

      return {
        seasons: seasonsCopy,
        lastWatched: { season: seasonNum, episode: epNum },
      };
    });

    onWatchlistChange(true);
    try {
      await api.post("/watchlist", {
        tmdbId,
        mediaType: "tv",
        title,
        poster,
      });
    } catch {}

    try {
      const res = await api.post("/progress/tv", {
        tmdbId,
        season: seasonNum,
        episode: epNum,
        title,
        poster,
        totalEpisodesForSeason: total,
      });
      if (res?.data?.progress) setProgress(res.data.progress);
      onToast(res.data?.message || "Progress updated");
    } catch {
      onToast("Failed to update progress");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div>
      {/* Season selector */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">
          Select Season
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {visibleSeasons.map((s) => (
            <button
              key={s.season_number}
              onClick={() => setActiveSeason(s.season_number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeSeason === s.season_number
                  ? "bg-[#FF7A1A] text-black"
                  : "bg-[#0B1120] text-[#F6E7C6] border border-slate-700 hover:border-[#FF7A1A]"
              }`}
            >
              Season {s.season_number}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#F6E7C6]">
            Season {activeSeason}
          </h3>
          <div className="text-xs text-slate-400">
            {seasonDetails[activeSeason]?.episodes?.length || 0} episodes
          </div>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-lg overflow-hidden">
          {loadingEp ? (
            <div className="p-6 text-center text-slate-400">
              Loading episodes...
            </div>
          ) : (seasonDetails[activeSeason]?.episodes || []).length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No episodes found for this season.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {seasonDetails[activeSeason].episodes.map((ep, idx) => (
                <EpisodeItem
                  key={ep.episode_number}
                  ep={ep}
                  seasonNumber={activeSeason}
                  watched={isEpisodeWatched(
                    activeSeason,
                    ep.episode_number
                  )}
                  onToggle={handleToggle}
                  isLast={
                    idx ===
                    seasonDetails[activeSeason].episodes.length - 1
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodesTab;
