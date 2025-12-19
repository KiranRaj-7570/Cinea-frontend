import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
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
import ProfileSkeleton from "../components/Skeletons/ProfileSkeleton";

const Profile = () => {
  const { id: routeUserId } = useParams();
  const { user, loginUser } = useContext(AuthContext);

  const isOwnProfile = !routeUserId || routeUserId === user?._id;
  const targetUserId = isOwnProfile ? user?._id : routeUserId;

  /* ================= PROFILE USER ================= */
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  /* ================= STATS ================= */
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "info") =>
    setToast({ show: true, message, type });

  /* ================= LOAD PROFILE USER ================= */
  useEffect(() => {
    if (!user) return;

    if (isOwnProfile) {
      setProfileUser(user);
      setFollowersCount(user.followers?.length || 0);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await api.get(`/auth/users/${routeUserId}`);
        setProfileUser(res.data.user);
        setIsFollowing(res.data.user.followers?.includes(user._id));
        setFollowersCount(res.data.user.followers?.length || 0);
      } catch {
        showToast("Failed to load profile", "error");
      }
    };

    loadUser();
  }, [routeUserId, isOwnProfile, user]);

  /* ================= FOLLOW / UNFOLLOW ================= */
  const handleFollowToggle = async () => {
    try {
      await api.post(`/auth/${routeUserId}/follow`);

      // 🔥 OPTIMISTIC — NO REFETCH
      setIsFollowing((prev) => !prev);
      setFollowersCount((c) => (isFollowing ? c - 1 : c + 1));
    } catch {
      showToast("Failed to update follow", "error");
    }
  };

  /* ================= FETCH STATS ================= */
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);

      const url = isOwnProfile
        ? "/profile/stats"
        : `/profile/stats/${routeUserId}`;

      const res = await api.get(url);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error", err);
    } finally {
      setLoadingStats(false);
    }
  }, [isOwnProfile, routeUserId]);

  useEffect(() => {
    if (targetUserId) fetchStats();
  }, [targetUserId, fetchStats]);

  /* ================= GENRE DONUT (UNCHANGED) ================= */
  const [genreData, setGenreData] = useState([]);
  const genreCache = useRef({});

  useEffect(() => {
    if (!stats?.genresSource?.length) {
      setGenreData([]);
      return;
    }

    const fetchGenres = async () => {
      const genreCount = {};

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

          if (genreCache.current[cacheKey]) {
            genreCache.current[cacheKey].forEach((g) => {
              genreCount[g] = (genreCount[g] || 0) + 1;
            });
            return;
          }

          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/${item.mediaType}/${item.tmdbId}?api_key=${
                import.meta.env.VITE_TMDB_KEY
              }`
            );
            const data = await res.json();
            const genres = (data.genres || []).map((g) => g.name);

            genreCache.current[cacheKey] = genres;
            genres.forEach((g) => {
              genreCount[g] = (genreCount[g] || 0) + 1;
            });
          } catch {}
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

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#111] text-white">
        <Navbar />
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col reem-kufi">
      <Navbar />

      <ProfileHeader
        name={profileUser.name}
        bio={profileUser.bio}
        avatar={profileUser.avatar}
        followersCount={followersCount}
        followingCount={profileUser.following?.length || 0}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onEdit={() => setIsEditOpen(true)}
         onAvatar={() => setIsAvatarOpen(true)} 
      />

      {/* 👇 REST OF YOUR UI IS UNCHANGED 👇 */}
       <main className="max-w-6xl mx-auto px-6 mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* GENRE DONUT */}
          <div className="bg-[#151515] rounded-3xl p-7 shadow-xl border border-white/5">
            <h4 className="text-lg mb-4 font-bold antonio text-[#FF7A1A]">
              Movies by Genre
            </h4>
            <GenreDonutChart data={genreData} loading={loadingStats} />
          </div>

          {/* WATCH TIME */}
          <div className="bg-[#151515] rounded-3xl  p-7 shadow-xl border border-white/5">
            <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-3">
              Watch Time
            </h4>
            <WatchTimeChart
              data={stats?.watchTime || []}
              loading={loadingStats}
            />

            <div className="mt-6 grid grid-cols-2 gap-4 reem-kufi ">
              {/* BEST */}
              <div className="bg-[#111] rounded-xl p-4">
                <p className="text-[16px] text-green-500 antonio mb-1">
                  Best Rated
                </p>

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
            <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-4">
              Your Top 5
            </h4>
            <TopFiveMovies
              movies={stats?.topFive || []}
              loading={loadingStats}
            />
          </div>
        </div>

        {/* RECENT REVIEWS */}
        <div className="mt-10 bg-[#151515] rounded-3xl p-7 shadow-xl border border-white/5">
          <h4 className="font-bold antonio text-lg text-[#FF7A1A] mb-3">
            Your Recent Reviews
          </h4>
          <RecentReviews
            reviews={stats?.recentReviews || []}
            loading={loadingStats}
          />
        </div>
      </main>
      {/* (Charts, Top 5, Reviews, Modals, Footer, Toast) */}

      <Footer />

      {isOwnProfile && (
        <>
          <EditProfileModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            user={user}
            onUpdate={loginUser}
            onSuccess={() =>
              showToast("Profile updated successfully", "success")
            }
          />

          <AvatarModal
            isOpen={isAvatarOpen}
            onClose={() => setIsAvatarOpen(false)}
            user={user}
            onUpdate={loginUser}
            onSuccess={() =>
              showToast("Avatar updated successfully", "success")
            }
          />
        </>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
};

export default Profile;
