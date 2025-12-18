import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const ReviewItem = ({ review, onReply, onLike, onDelete, onEdit }) => {
  const { user } = useContext(AuthContext);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [editRating, setEditRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);

  const isOwner = user && user._id === review.userId;
  const isAdmin = user && user.role === "admin";
  const canDelete = isOwner || isAdmin;
  const canEdit = isOwner;

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(review._id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await api.put(`/reviews/${review._id}`, {
        text: editText.trim(),
        rating: editRating,
      });
      onEdit(review._id, { text: editText.trim(), rating: editRating });
      setShowEdit(false);
    } catch (err) {
      console.error("Edit review err", err);
      alert("Failed to edit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    setLoading(true);
    try {
      await api.delete(`/reviews/${review._id}`);
      onDelete(review._id);
    } catch (err) {
      console.error("Delete review err", err);
      alert("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 shrink-0 flex items-center justify-center text-sm text-white">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            review.username?.[0] || "U"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-[#F6E7C6]">
                {review.username}
              </div>
              <div className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-yellow-400 shrink-0">
              {"★".repeat(Math.round(review.rating))}
            </div>
          </div>

          {showEdit ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300">Rating:</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="bg-[#020617] text-white px-2 py-1 rounded text-xs"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 bg-transparent border border-slate-700 text-white rounded text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="px-3 py-1 bg-[#FF7A1A] rounded text-black text-xs font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setShowEdit(false);
                    setEditText(review.text);
                    setEditRating(review.rating);
                  }}
                  className="px-3 py-1 border border-slate-700 rounded text-slate-300 text-xs hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-200">{review.text}</p>
          )}

          {review.replies && review.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {review.replies.map((r, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-300 bg-slate-900 p-2 rounded"
                >
                  <div className="font-semibold text-xs">{r.username}</div>
                  <div className="text-xs">{r.text}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowReply((s) => !s)}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Reply
            </button>
            <button
              onClick={() => onLike(review._id)}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              {review.likes?.length || 0} Likes
            </button>

            {canEdit && !showEdit && (
              <button
                onClick={() => setShowEdit(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>

          {showReply && (
            <div className="mt-2">
              <textarea
                className="w-full bg-transparent border border-slate-700 rounded p-2 text-sm text-white"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReply}
                  className="px-3 py-1 rounded bg-[#FF7A1A] text-black text-xs font-medium hover:bg-orange-600"
                >
                  Send
                </button>
                <button
                  onClick={() => setShowReply(false)}
                  className="px-3 py-1 rounded bg-transparent border border-slate-700 text-slate-300 text-xs hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;