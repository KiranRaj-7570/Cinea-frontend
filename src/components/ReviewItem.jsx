import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import { AlertTriangle } from "lucide-react";

const ReviewItem = ({ review, onReply, onLike, onDelete, onEdit }) => {
  const { user } = useContext(AuthContext);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [editRating, setEditRating] = useState(review.rating);

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  /* confirm + toast state */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) =>
    setToast({ show: true, message });

  const isOwner = user && user._id === review.userId;
  const isAdmin = user && user.role === "admin";

  const canDelete = isOwner || isAdmin;
  const canEdit = isOwner;

  /* ================= REPLY ================= */

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(review._id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  /* ================= EDIT ================= */

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await api.put(`/reviews/${review._id}`, {
        text: editText.trim(),
        rating: editRating,
      });

      onEdit(review._id, {
        text: editText.trim(),
        rating: editRating,
      });

      setShowEdit(false);
      showToast("Review updated");
    } catch (err) {
      console.error("Edit review err", err);
      showToast("Failed to edit review");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/reviews/${review._id}`);
      onDelete(review._id);
      showToast("Review deleted");
    } catch (err) {
      console.error("Delete review err", err);
      showToast("Failed to delete review");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  /* ================= REPORT ================= */

  const handleReport = async () => {
    if (!reportReason.trim()) {
      showToast("Please select a reason");
      return;
    }

    setReportLoading(true);
    try {
      await api.post(`/reviews/${review._id}/report`, {
        reason: reportReason,
        description: reportDescription.trim(),
      });
      showToast("Review reported successfully");
      setReportOpen(false);
      setReportReason("");
      setReportDescription("");
    } catch (err) {
      console.error("Report review err", err);
      const msg = err.response?.data?.message || "Failed to report review";
      showToast(msg);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#1f1f1f] border border-slate-800 rounded-lg p-3 sm:p-4 poppins-regular">
        <div className="flex items-start gap-3">
          {/* Avatar */}
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-orange-400">
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

            {/* Edit mode */}
            {showEdit ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-300">Rating:</label>
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="bg-[#181818] text-white px-2 py-1 rounded text-xs"
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
                    className="px-3 py-1 border border-slate-700 rounded text-[#F6E7C6] text-xs hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#F6E7C6]">
                {review.text}
              </p>
            )}

            {/* Replies */}
            {review.replies?.length > 0 && (
              <div className="mt-3 space-y-2">
                {review.replies.map((r, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-[#2f2f2f]  p-2 rounded"
                  >
                    <div className="font-semibold text-xs text-orange-400">
                      {r.username}
                    </div>
                    <div className="text-xs">{r.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <button
                onClick={() => setShowReply((s) => !s)}
                className="text-[#F6E7C6] hover:text-slate-200 transition"
              >
                Reply
              </button>

              <span className="text-slate-600">•</span>

              <button
                onClick={() => onLike(review._id)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                {review.likes?.length || 0} Likes
              </button>

              <span className="text-slate-600">•</span>

              {canEdit && !showEdit && (
                <>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Edit
                  </button>
                  <span className="text-slate-600">•</span>
                </>
              )}

              {canDelete && (
                <>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                  {!isOwner && !isAdmin && <span className="text-slate-600">•</span>}
                </>
              )}

              {user && !isOwner && !isAdmin && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="text-red-500 hover:text-red-400 transition flex items-center gap-1 font-semibold"
                >
                  <AlertTriangle size={14} /> Report
                </button>
              )}
            </div>

            {/* Reply box */}
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

      {/* REPORT MODAL */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f1f] border border-slate-700 rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-slate-700 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="font-semibold">Report Review</h3>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-[#FF7A1A] focus:outline-none"
                >
                  <option value="">Select a reason</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="spam">Spam</option>
                  <option value="offensive">Offensive Language</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Description (optional)</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide more details..."
                  className="w-full bg-[#0f0f0f] border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-[#FF7A1A] focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-700 flex gap-2">
              <button
                onClick={handleReport}
                disabled={reportLoading || !reportReason}
                className="flex-1 px-4 py-2 bg-[#FF7A1A] hover:bg-orange-500 disabled:bg-slate-600 text-black font-semibold rounded text-sm transition"
              >
                {reportLoading ? "Reporting..." : "Report"}
              </button>
              <button
                onClick={() => {
                  setReportOpen(false);
                  setReportReason("");
                  setReportDescription("");
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete review?"
        description="This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </>
  );
};

export default ReviewItem;
