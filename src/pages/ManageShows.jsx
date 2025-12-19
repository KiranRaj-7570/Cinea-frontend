import { useEffect, useState } from "react";
import api from "../api/axios";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [confirmAction, setConfirmAction] = useState(null);

  const loadShows = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/shows");
      setShows(res.data);
    } catch (err) {
      console.error("Load shows error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteShow = async (id) => {
    setConfirmAction({
      title: "Delete this show?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          setDeleteLoading(id);
          await api.delete(`/admin/shows/${id}`);
          setShows((prev) => prev.filter((s) => s._id !== id));
          setConfirmAction(null);
          setToast({ show: true, message: "Show deleted successfully" });
        } catch (err) {
          setToast({ show: true, message: "Failed to delete show" });
        } finally {
          setDeleteLoading(null);
        }
      },
    });
  };

  useEffect(() => {
    loadShows();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[#FF7A1A]">Manage Shows</h1>

      {loading ? (
        <p className="text-slate-400">Loading shows...</p>
      ) : shows.length === 0 ? (
        <div className="bg-[#151515] border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">No shows created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows.map((show) => (
            <div
              key={show._id}
              className="bg-[#151515] border border-slate-700 rounded-lg p-4 hover:border-[#FF7A1A] transition"
            >
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Movie ID</p>
                <p className="font-semibold text-lg">{show.movieId}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Theatre & Screen</p>
                <p className="text-sm">
                  {show.theatreId?.name} • Screen {show.screenNumber}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Date & Time</p>
                <p className="text-sm font-mono">
                  {new Date(show.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  @ {show.time}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Format & Language</p>
                <p className="text-sm">
                  {show.format} • {show.language}
                </p>
              </div>

              <button
                onClick={() => deleteShow(show._id)}
                disabled={deleteLoading === show._id}
                className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Trash2 size={16} /> {deleteLoading === show._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
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
          loading={deleteLoading}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />    </div>
  );
};

export default ManageShows;
