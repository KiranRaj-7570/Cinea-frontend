import { useEffect, useState } from "react";
import api from "../api/axios";
import { AlertCircle, MapPin, Monitor } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [confirmAction, setConfirmAction] = useState(null);

  const loadTheatres = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/theatres");
      setTheatres(res.data);
    } catch (err) {
      console.error("Load theatres error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTheatre = async (id) => {
    setConfirmAction({
      title: "Deactivate this theatre?",
      description: "This will disable the theatre from accepting new bookings.",
      confirmText: "Deactivate",
      confirmVariant: "warning",
      onConfirm: async () => {
        try {
          setDeleteLoading(id);
          await api.delete(`/admin/theatres/${id}`);
          setTheatres((prev) => prev.filter((t) => t._id !== id));
          setConfirmAction(null);
          setToast({ show: true, message: "Theatre deactivated successfully" });
        } catch (err) {
          setToast({ show: true, message: "Failed to deactivate theatre" });
        } finally {
          setDeleteLoading(null);
        }
      },
    });
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[#FF7A1A]">Manage Theatres</h1>

      {loading ? (
        <p className="text-slate-400">Loading theatres...</p>
      ) : theatres.length === 0 ? (
        <div className="bg-[#151515] border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">No theatres added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {theatres.map((t) => (
            <div
              key={t._id}
              className="bg-[#151515] border border-slate-700 rounded-lg p-4 hover:border-[#FF7A1A] transition flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-4">{t.name}</h3>

              <div className="space-y-3 flex-1 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-[#FF7A1A]" />
                  <span className="text-slate-300">{t.city}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Monitor size={16} className="text-[#FF7A1A]" />
                  <span className="text-slate-300">
                    {t.screens?.length || 0} Screen{t.screens?.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {t.screens?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Screens:</p>
                    <div className="flex gap-2 flex-wrap">
                      {t.screens.map((s) => (
                        <span
                          key={s.screenNumber}
                          className="px-2 py-1 bg-slate-800 text-xs rounded"
                        >
                          S{s.screenNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteTheatre(t._id)}
                disabled={deleteLoading === t._id}
                className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <AlertCircle size={16} /> {deleteLoading === t._id ? "Deactivating..." : "Deactivate"}
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

export default ManageTheatres;
