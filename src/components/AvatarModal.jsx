import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "../api/axios";

const AvatarModal = ({ isOpen, onClose, onSuccess, user, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose an image first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      const res = await api.delete("/auth/remove-avatar");
      onUpdate(res.data.user);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="bg-[#151515] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-white">
                Update Avatar
              </Dialog.Title>

              <p className="text-xs text-slate-400 mt-1">
                Choose a new profile picture
              </p>

              {/* AVATAR PREVIEW */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-full border border-white/10 bg-[#111] overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} className="h-full w-full object-cover" />
                  ) : user.avatar ? (
                    <img src={user.avatar} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-300">
                      {user.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  )}
                </div>

                <label className="cursor-pointer text-xs">
                  <span className="px-4 py-1.5 rounded-full border border-white/20 hover:border-orange-400 hover:text-orange-300 transition">
                    Choose image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* ACTIONS */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold rounded-full bg-orange-500 hover:bg-orange-600 transition disabled:opacity-60"
                >
                  {loading ? "Uploading..." : "Upload avatar"}
                </button>

                {user.avatar && (
                  <button
                    onClick={handleRemove}
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-semibold rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 transition disabled:opacity-60"
                  >
                    {loading ? "Removing..." : "Remove avatar"}
                  </button>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AvatarModal;
