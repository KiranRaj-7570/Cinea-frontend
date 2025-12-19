import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger", // "danger" | "primary" | "warning"
  loading = false,
  onConfirm,
  onCancel,
  disableBackdropClose = false,
}) => {
  if (!open) return null;

  const confirmStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    primary: "bg-[#FF7A1A] hover:bg-orange-500 text-black font-semibold",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold",
  };

  const getIcon = () => {
    switch (confirmVariant) {
      case "danger":
        return <AlertTriangle size={28} className="text-red-500" />;
      case "warning":
        return <AlertCircle size={28} className="text-yellow-500" />;
      default:
        return <Info size={28} className="text-blue-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => {
        if (!disableBackdropClose) onCancel?.();
      }}
    >
      <div
        className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 sm:p-8 w-full max-w-sm border border-slate-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-slate-800/50">
            {getIcon()}
          </div>
        </div>

        {/* CONTENT */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-center text-white">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-slate-400 mb-6 text-center">
          {description}
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2
              ${confirmStyles[confirmVariant] || confirmStyles.danger}
              ${loading ? "opacity-70" : ""}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
