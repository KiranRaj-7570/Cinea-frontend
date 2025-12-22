import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import defaultAvatar from "../assets/avatar.png";

const FollowListModal = ({ open, onClose, userId, type, onFollowCountChange }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/auth/users/${userId}/${type}`);
        setUsers(
  (res.data.users || []).map((u) => ({
    ...u,
    isFollowing: u.isFollowing ?? false,
  }))
);
      } catch {
        console.error("Failed to load follow list");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, userId, type]);

  /* ================= FOLLOW / UNFOLLOW ================= */
  const toggleFollow = async (targetId) => {
  let delta = 0;

  setUsers((prev) =>
    prev.map((u) => {
      if (u._id === targetId) {
        delta = u.isFollowing ? -1 : 1;
        return { ...u, isFollowing: !u.isFollowing };
      }
      return u;
    })
  );

  if (onFollowCountChange) {
    onFollowCountChange((prev) => prev + delta);
  }

  try {
    await api.post(`/auth/${targetId}/follow`);
  } catch {
    // rollback
    setUsers((prev) =>
      prev.map((u) =>
        u._id === targetId
          ? { ...u, isFollowing: !u.isFollowing }
          : u
      )
    );

    if (onFollowCountChange) {
      onFollowCountChange((prev) => prev - delta);
    }
  }
};


  if (!open) return null;

  const title = type === "followers" ? "Followers" : "Following";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center">
      <div className="bg-[#111] w-full max-w-md h-[85vh] mt-12 rounded-2xl border border-white/10 shadow-xl flex flex-col">

        {/* HEADER (sticky feel) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-[#F6E7C6]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* LIST (scroll only here) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

          {loading && (
            <p className="text-sm text-slate-400 text-center">
              Loading…
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-sm text-slate-500 text-center mt-10">
              {type === "followers"
                ? "No followers yet"
                : "Not following anyone yet"}
            </p>
          )}

          {users.map((u) => {
            const isMe = u._id === user?._id;
            const following = u.isFollowing === true;

            return (
              <div
                key={u._id}
                className="flex items-center justify-between gap-3"
              >
                {/* USER INFO */}
                <div
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${u._id}`);
                  }}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <img
                    src={u.avatar || defaultAvatar}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={u.name}
                  />
                  <span className="text-sm text-[#F6E7C6] truncate">
                    {u.name}
                  </span>
                </div>

                {/* FOLLOW BUTTON */}
                {!isMe && (
                  <button
                    onClick={() => toggleFollow(u._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition
                      ${
                        following
                          ? "bg-[#222] text-[#F6E7C6]"
                          : "bg-[#FF7A1A] text-black"
                      }
                    `}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-[#222] text-sm text-white hover:bg-[#333]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
