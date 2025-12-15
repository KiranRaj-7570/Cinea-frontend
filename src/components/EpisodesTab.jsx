import { useEffect, useState, useContext, useRef, useMemo } from "react";
import api from "../api/axios";
import EpisodeItem from "./EpisodeItem";
import { AuthContext } from "../context/AuthContext";

/**
 * Props:
 * - tmdbId
 * - seasons
 * - title
 * - poster
 * - inWatchlist
 * - onWatchlistChange
 * - onToast
 */
const EpisodesTab = ({
  tmdbId,
  seasons = [],
  title,
  poster,
  inWatchlist,
  onWatchlistChange = () => {},
  onToast = () => {},
}) => {
  const { user } = useContext(AuthContext);


  const visibleSeasons = useMemo(() => {
  return (seasons || []).filter((s) => s.season_number !== 0);
}, [seasons]);


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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/progress/tv/${tmdbId}`);
        setProgress(
          res.data.progress || {
            seasons: [],
            lastWatched: { season: 0, episode: 0 },
          }
        );
      } catch (err) {
        console.error("Load progress", err);
      }
    };
    load();
  }, [tmdbId]);


  useEffect(() => {
    const reload = async () => {
      try {
        const res = await api.get(`/progress/tv/${tmdbId}`);
        setProgress(
          res.data.progress || {
            seasons: [],
            lastWatched: { season: 0, episode: 0 },
          }
        );
      } catch {}
    };
    reload();
  }, [inWatchlist, tmdbId]);

 
  const fetchSeasonDetails = async (seasonNumber) => {
    if (seasonDetails[seasonNumber]) return; 
    setLoadingEp(true);
    try {
      const res = await api.get(`/tvshows/${tmdbId}/season/${seasonNumber}`);

      if (!isMounted.current) return;

      setSeasonDetails((s) => ({
        ...s,
        [seasonNumber]: res.data,
      }));
    } catch (err) {
      console.error(err);
      onToast("Failed to load episodes");
    } finally {
      setLoadingEp(false);
    }
  };

  useEffect(() => {
    if (activeSeason !== null && activeSeason !== undefined) {
      fetchSeasonDetails(activeSeason);
    }
  }, [activeSeason]);

  const isEpisodeWatched = (seasonNumber, episodeNumber) => {
    const s = progress.seasons?.find(
      (x) => x.seasonNumber === Number(seasonNumber)
    );
    if (!s) return false;
    return s.watchedEpisodes.includes(Number(episodeNumber));
  };

  const handleToggle = async (seasonNumber, episodeNumber) => {
  if (!user) return onToast("Login to track progress");

  const seasonNum = Number(seasonNumber);
  const epNum = Number(episodeNumber);

  // Ensure we have season details (for totalEpisodes)
  let seasonData = seasonDetails[seasonNum];
  if (!seasonData) {
    seasonData = await fetchSeasonDetails(seasonNum);
  }
  const total = seasonData?.episodes?.length || 0;

  // OPTIMISTIC UPDATE (consistent undo rules)
  setProgress((prev) => {
    const prevSeasons = Array.isArray(prev?.seasons) ? prev.seasons : [];
    const p = {
      seasons: [...prevSeasons],
      lastWatched: { ...(prev?.lastWatched || { season: 0, episode: 0 }) },
    };

    let season = p.seasons.find((s) => s.seasonNumber === seasonNum);
    if (!season) {
      season = { seasonNumber: seasonNum, watchedEpisodes: [] };
      p.seasons.push(season);
    }

    season.watchedEpisodes = Array.isArray(season.watchedEpisodes)
      ? [...season.watchedEpisodes]
      : [];

    const maxWatched = season.watchedEpisodes.length
      ? Math.max(...season.watchedEpisodes)
      : 0;
    const already = season.watchedEpisodes.includes(epNum);

    if (!already) {
      // mark 1..epNum
      season.watchedEpisodes = Array.from({ length: epNum }, (_, i) => i + 1);
    } else {
      if (epNum === maxWatched) {
        // undo the last watched — remove only this episode
        season.watchedEpisodes = season.watchedEpisodes.filter((e) => e !== epNum);
      } else {
        // clicked a lower already-watched ep — remove everything above clicked ep
        season.watchedEpisodes = season.watchedEpisodes.filter((e) => e <= epNum);
      }
    }

    // recompute lastWatched
    let last = { season: 0, episode: 0 };
    for (const se of p.seasons) {
      if (!se.watchedEpisodes || se.watchedEpisodes.length === 0) continue;
      const maxEp = Math.max(...se.watchedEpisodes);
      if (
        se.seasonNumber > last.season ||
        (se.seasonNumber === last.season && maxEp > last.episode)
      ) {
        last = { season: se.seasonNumber, episode: maxEp };
      }
    }
    p.lastWatched = last;

    return p;
  });

  // Ensure watchlist shows instantly
  onWatchlistChange(true);
  try { await api.post("/watchlist", { tmdbId, mediaType: "tv", title, poster }); } catch {}

  // Backend sync (send total episodes so server can update properly)
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
    onToast(res.data.message || "Progress updated");
  } catch (err) {
    console.error("Toggle ep err", err);
    onToast("Failed to update progress");
  }
};

  return (
    <div>
     
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {visibleSeasons.map((s) => (
          <button
            key={s.season_number}
            onClick={() => setActiveSeason(s.season_number)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeSeason === s.season_number
                ? "bg-[#FF7A1A] text-black"
                : "bg-[#0B1120] text-[#F6E7C6] border border-slate-700"
            }`}
          >
            Season {s.season_number}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="text-sm text-slate-400 mb-1">
          Season {activeSeason}
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3">
          {loadingEp ? (
            <p className="text-slate-400">Loading episodes...</p>
          ) : (
            <>
              {(seasonDetails[activeSeason]?.episodes || []).map((ep) => (
                <EpisodeItem
                  key={ep.episode_number}
                  ep={ep}
                  seasonNumber={activeSeason}
                  watched={isEpisodeWatched(
                    activeSeason,
                    ep.episode_number
                  )}
                  onToggle={handleToggle}
                />
              ))}

              {(seasonDetails[activeSeason]?.episodes || []).length ===
                0 && (
                <p className="text-slate-400 text-sm">
                  No episodes found for this season.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodesTab;
