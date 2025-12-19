import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AlertTriangle, Trash2, X, Eye } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

const ReviewReports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [confirmAction, setConfirmAction] = useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reviews/reported?sort=${sort}&page=${page}&limit=${limit}`);
      setReports(res.data.reviews);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Load reports error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [sort, page]);

  const viewReviewDetails = async (reviewId) => {
    try {
      const res = await api.get(`/admin/reviews/${reviewId}`);
      setSelectedReview(res.data);
      setShowModal(true);
    } catch (err) {
      setToast({ show: true, message: "Failed to load review details" });
    }
  };

  const dismissReport = async (reviewId, reportUserId) => {
    try {
      setActionLoading(true);
      await api.post(`/admin/reviews/${reviewId}/dismiss-report`, {
        reportUserId,
      });
      loadReports();
      setShowModal(false);
      setToast({ show: true, message: "Report dismissed" });
    } catch (err) {
      setToast({ show: true, message: "Failed to dismiss report" });
    } finally {
      setActionLoading(false);
    }
  };

  const clearAllReports = async (reviewId) => {
    setConfirmAction({
      title: "Clear all reports?",
      description: "This will dismiss all reports for this review. The review will remain published.",
      confirmText: "Clear All",
      confirmVariant: "warning",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await api.post(`/admin/reviews/${reviewId}/clear-reports`);
          loadReports();
          setShowModal(false);
          setConfirmAction(null);
          setToast({ show: true, message: "All reports cleared" });
        } catch (err) {
          setToast({ show: true, message: "Failed to clear reports" });
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const deleteReview = async (reviewId) => {
    setConfirmAction({
      title: "Delete this review?",
      description: "This action cannot be undone. The review will be permanently deleted from the system.",
      confirmText: "Delete",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await api.delete(`/admin/reviews/${reviewId}`, {
            data: { reason: "Admin removed due to reports" },
          });
          loadReports();
          setShowModal(false);
          setConfirmAction(null);
          setToast({ show: true, message: "Review deleted successfully" });
        } catch (err) {
          setToast({ show: true, message: "Failed to delete review" });
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const getReason = (reason) => {
    const reasons = {
      inappropriate: "Inappropriate Content",
      spam: "Spam",
      offensive: "Offensive Language",
      other: "Other",
    };
    return reasons[reason] || reason;
  };

  const hasNextPage = page * limit < total;
  const hasPrevPage = page > 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[#FF7A1A]">Reported Reviews</h1>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#151515] border border-slate-700 rounded-lg focus:border-[#FF7A1A] focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="most-reported">Most Reported</option>
        </select>

        <div className="text-sm text-slate-400 px-4 py-2">
          Total: <span className="text-[#FF7A1A] font-semibold">{total}</span> reported
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="bg-[#151515] border border-slate-700 rounded-lg p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 text-slate-500" size={32} />
          <p className="text-slate-400">No reported reviews at the moment.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-[#151515] border border-slate-700 rounded-lg p-4 hover:border-[#FF7A1A] transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={18} className="text-red-500" />
                      <p className="text-sm font-semibold text-red-500">
                        {report.reportCount} Report{report.reportCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <h3 className="font-semibold text-base mb-1">{report.title}</h3>

                    <p className="text-sm text-slate-400 mb-2">
                      By {report.username} • {report.mediaType === "tv" ? "Series" : "Movie"}
                    </p>

                    <p className="text-sm line-clamp-2 text-slate-300 mb-3">
                      "{report.text}"
                    </p>

                    <div className="text-xs text-slate-500">
                      Rating: <span className="text-[#FF7A1A]">{"⭐".repeat(report.rating)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-col">
                    <button
                      onClick={() => viewReviewDetails(report._id)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 flex items-center justify-center gap-2 transition text-sm"
                    >
                      <Eye size={16} /> View
                    </button>

                    <button
                      onClick={() => deleteReview(report._id)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30 flex items-center justify-center gap-2 transition text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {total > limit && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrevPage}
                className="px-4 py-2 bg-[#151515] border border-slate-700 rounded hover:bg-slate-800 disabled:opacity-50 transition"
              >
                ← Prev
              </button>

              <div className="px-4 py-2 text-slate-400 text-sm">
                Page {page} of {Math.ceil(total / limit)}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 bg-[#151515] border border-slate-700 rounded hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151515] border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#151515] border-b border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:text-red-400 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* REVIEW INFO */}
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedReview.title}</h3>
                <p className="text-slate-400 text-sm mb-3">
                  By {selectedReview.username} • {selectedReview.mediaType === "tv" ? "Series" : "Movie"}
                </p>
                <p className="text-sm text-slate-300 mb-3">{selectedReview.text}</p>
                <p className="text-sm">
                  Rating: <span className="text-[#FF7A1A]">{"⭐".repeat(selectedReview.rating)}</span>
                </p>
              </div>

              {/* REPORTS */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  Reports ({selectedReview.reports.length})
                </h4>

                <div className="space-y-3">
                  {selectedReview.reports.map((report, idx) => (
                    <div key={idx} className="bg-[#1a1a1a] border border-slate-700 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-red-400">
                            {getReason(report.reason)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(report.reportedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <button
                          onClick={() => dismissReport(selectedReview._id, report.userId._id)}
                          disabled={actionLoading}
                          className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </div>

                      {report.description && (
                        <p className="text-xs text-slate-400 mt-2">{report.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => clearAllReports(selectedReview._id)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded border border-yellow-600/30 transition disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "Clear All Reports"}
                </button>

                <button
                  onClick={() => deleteReview(selectedReview._id)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded border border-red-600/30 transition disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "Delete Review"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <ConfirmModal
          open={true}
          title={confirmAction.title}
          description={confirmAction.description}
          confirmText={confirmAction.confirmText}
          confirmVariant={confirmAction.confirmVariant}
          loading={actionLoading}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default ReviewReports;
