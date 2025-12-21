import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import api from "../api/axios";
import defaultAvatar from "../assets/avatar.png";
import NotificationSkeleton from "./Skeletons/NotificationSkeleton";

const NotificationsModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!open) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [open]);

  /* ================= MARK READ ================= */
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  /* ================= DELETE ================= */
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ================= ROW CLICK ================= */
  const handleRowClick = (notif) => {
    markAsRead(notif._id);

    if (notif.type === "follow") {
      navigate(`/profile/${notif.fromUserId._id}`);
    } else if (
      notif.type === "review_like" ||
      notif.type === "review_reply"
    ) {
      navigate(`/movie/${notif.movieId}#reviews`);
    } else if (notif.type === "booking_reminder") {
      navigate(`/my-bookings`);
    }

    onClose();
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-[60] flex justify-end pointer-events-none">
        <div className="bg-[#111] w-full sm:w-96 h-full rounded-l-2xl border-l border-white/10 shadow-xl flex flex-col pointer-events-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-[#F6E7C6]">
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto">
            {loading && <NotificationSkeleton />}

            {!loading && notifications.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-500">
                No notifications yet
              </div>
            )}

            {!loading && notifications.length > 0 && (
              <div className="space-y-2 p-4">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleRowClick(notif)}
                    className={`relative p-4 rounded-lg border cursor-pointer transition
                      ${
                        notif.read
                          ? "bg-[#0a0a0a] border-white/5 opacity-70"
                          : "bg-[#1a1a1a] border-[#FF7A1A]/30 hover:bg-[#252525]"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* AVATAR */}
                      <img
                        src={notif.fromUserId?.avatar || defaultAvatar}
                        alt={notif.fromUserId?.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate(`/profile/${notif.fromUserId._id}`);
                        }}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      />

                      {/* TEXT */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#F6E7C6]">
                          <span className="font-semibold">
                            {notif.fromUserId?.name}
                          </span>{" "}
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* DELETE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}
                        className="text-slate-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {!notif.read && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF7A1A] rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
};

export default NotificationsModal;
