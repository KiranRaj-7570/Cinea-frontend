import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

const MarkSeriesCompletedButton = ({
  tmdbId,
  inWatchlist,
  completed,
  onCompletedChange = () => {},
  onToast = () => {},
}) => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("complete"); // "complete" | "uncomplete"

  if (!user || !inWatchlist) return null;

  const markCompleted = async () => {
    setLoading(true);
    try {
      await api.post(`/watchlist/tv/${tmdbId}/complete`);
      onCompletedChange(true);
      onToast("Series marked as completed 🎉");
    } catch (err) {
      onToast(
        err.response?.data?.message || "Failed to mark series completed"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const unmarkCompleted = async () => {
    setLoading(true);
    try {
      await api.post(`/watchlist/tv/${tmdbId}/uncomplete`);
      onCompletedChange(false);
      onToast("Series unmarked");
    } catch (err) {
      onToast(
        err.response?.data?.message || "Failed to unmark series"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const isCompleted = Boolean(completed);

  return (
    <>
      <button
        onClick={() => {
          setMode(isCompleted ? "uncomplete" : "complete");
          setOpen(true);
        }}
        className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition
          ${
            isCompleted
              ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "border border-[#FF7A1A] text-[#FF7A1A] hover:bg-[#FF7A1A] hover:text-black"
          }
        `}
      >
        {isCompleted ? "✓ Series Completed" : "Mark Series Completed"}
      </button>

      <ConfirmModal
        open={open}
        title={
          isCompleted
            ? "Unmark series as completed?"
            : "Mark series as completed?"
        }
        description={
          isCompleted
            ? "This will restore episode progress and mark the series as ongoing."
            : "All episodes will be marked as watched."
        }
        confirmText={isCompleted ? "Unmark" : "Mark Completed"}
        confirmVariant={isCompleted ? "warning" : "primary"}
        loading={loading}
        onConfirm={isCompleted ? unmarkCompleted : markCompleted}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default MarkSeriesCompletedButton;
