import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef, // ✅ FIXED: missing import
} from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditProfileModal from "../components/EditProfileModal";
import AvatarModal from "../components/AvatarModal";
import ProfileHeader from "../components/ProfileHeader";

import GenreDonutChart from "../components/GenreDonutChart";
import WatchTimeChart from "../components/WatchTimeChart";
import TopFiveMovies from "../components/TopFiveMovies";
import RecentReviews from "../components/RecentReviews";
import Toast from "../components/Toast";

const Profile = () => {
  const { user, loginUser } = useContext(AuthContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/profile/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);
  const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "info",
});

const showToast = (message, type = "info") => {
  setToast({ show: true, message, type });
};

const closeToast = () => {
  setToast((t) => ({ ...t, show: false }));
};

  useEffect(() => {
    if (user) fetchStats();
  }, [user, fetchStats]);

  /* ================= GENRE DONUT DATA ================= */

  const [genreData, setGenreData] = useState([]);
  const genreCache = useRef({}); // in-memory cache

  useEffect(() => {
    if (!stats?.genresSource?.length) {
      setGenreData([]);
      return;
    }

    const fetchGenres = async () => {
      const genreCount = {};

      // Deduplicate TMDB IDs
      const uniqueItems = Array.from(
        new Map(
          stats.genresSource.map((item) => [
            `${item.mediaType}-${item.tmdbId}`,
            item,
          ])
        ).values()
      );

      await Promise.all(
        uniqueItems.map(async (item) => {
          const cacheKey = `${item.mediaType}-${item.tmdbId}`;

          // Cache hit
          if (genreCache.current[cacheKey]) {
            genreCache.current[cacheKey].forEach((g) => {
              genreCount[g] = (genreCount[g] || 0) + 1;
            });
            return;
          }

          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/${item.mediaType}/${
                item.tmdbId
              }?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );

            const data = await res.json();
            const genres = (data.genres || []).map((g) => g.name);

            // Save to cache
            genreCache.current[cacheKey] = genres;

            genres.forEach((g) => {
              genreCount[g] = (genreCount[g] || 0) + 1;
            });
          } catch (err) {
            console.error("TMDB genre fetch failed", err);
          }
        })
      );

      setGenreData(
        Object.entries(genreCount).map(([label, value]) => ({
          label,
          value,
        }))
      );
    };

    fetchGenres();
  }, [stats?.genresSource]);

  /* ================= RENDER ================= */

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col reem-kufi ">
      <Navbar />

      {/* HEADER */}
      <ProfileHeader
        name={user.name}
        bio={user.bio}
        avatar={user.avatar}
        followersCount={user.followers?.length || 0}
        followingCount={user.following?.length || 0}
        onEdit={() => setIsEditOpen(true)}
        onAvatar={() => setIsAvatarOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-6 mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* GENRE DONUT */}
          <div className="bg-[#151515] rounded-3xl p-7 shadow-xl border border-white/5">
            <h4 className="text-lg mb-4 font-bold antonio text-[#FF7A1A]">Movies by Genre</h4>
            <GenreDonutChart data={genreData} loading={loadingStats}/>
          </div>

          {/* WATCH TIME */}
          <div className="bg-[#151515] rounded-3xl  p-7 shadow-xl border border-white/5">
            <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-3">Watch Time</h4>
            <WatchTimeChart
              data={stats?.watchTime || []}
              loading={loadingStats}
            />

            <div className="mt-6 grid grid-cols-2 gap-4 reem-kufi ">
              {/* BEST */}
              <div className="bg-[#111] rounded-xl p-4">
                <p className="text-[16px] text-green-500 antonio mb-1">Best Rated</p>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-[#F6E7C6]">
                    {stats?.best?.rating ?? "-"}
                  </span>
                  <span className="text-sm text-orange-400 font-semibold">
                    / <span className="text-[#F6E7C6]"> 5</span>
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#FF7A1A] truncate">
                  {stats?.best?.title || "—"}
                </p>
              </div>

              {/* WORST */}
              <div className="bg-[#111] rounded-xl p-4">
                <p className="text-[16px] text-red-500 mb-1 antonio ">
                  Worst Rated
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#F6E7C6]">
                    {stats?.worst?.rating ?? "-"}
                  </span>
                  <span className="text-sm text-orange-400 font-semibold">
                    / <span className="text-[#F6E7C6]"> 5</span>
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#FF7A1A] truncate">
                  {stats?.worst?.title || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* TOP 5 */}
          <div className="bg-[#151515] rounded-3xl p-7 shadow-xl border border-white/5">
            <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-4">Your Top 5</h4>
            <TopFiveMovies
              movies={stats?.topFive || []}
              loading={loadingStats}
            />
          </div>
        </div>

        {/* RECENT REVIEWS */}
        <div className="mt-10 bg-[#151515] rounded-3xl p-7 shadow-xl border border-white/5">
          <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-3">Your Recent Reviews</h4>
          <RecentReviews
            reviews={stats?.recentReviews || []}
            loading={loadingStats}
          />
        </div>
      </main>

      <Footer />

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        onUpdate={loginUser}
        onSuccess={() => showToast("Profile updated successfully ", "success")}
      />

      <AvatarModal
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        user={user}
        onUpdate={loginUser}
        onSuccess={() => showToast("Avatar updated successfully ", "success")}
      />
      <Toast
  show={toast.show}
  message={toast.message}
  type={toast.type}
  onClose={closeToast}
/>
    </div>
  );
};

export default Profile;
