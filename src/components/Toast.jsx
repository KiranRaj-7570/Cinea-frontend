import { useEffect } from "react";

const Toast = ({ message, show, onClose, type = "info" }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="max-w-xs px-4 py-3 rounded-lg shadow-lg bg-[#0B1120] border-l-4 border-[#FF7A1A] text-white">
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
