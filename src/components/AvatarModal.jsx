import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "../api/axios";

const AvatarModal = ({ isOpen, onClose, user, onUpdate }) => {
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
      setError("Please select a valid image file.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(res.data.user);
      onClose();
    } catch (err) {
      console.error(err);
      console.log(JSON.stringify(err, null, 2));
      setError(
        err.response?.data?.msg || "Failed to upload avatar. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.delete("/auth/remove-avatar");
      onUpdate(res.data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg || "Failed to remove avatar. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

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
            <Dialog.Panel className="bg-[#020617] border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-white">
                Update Avatar
              </Dialog.Title>
              <p className="text-xs text-slate-400 mt-1">
                Choose a new image or remove your current avatar.
              </p>

              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-full border border-slate-600 bg-slate-900 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Current avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-slate-300 font-semibold">
                      {user.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  )}
                </div>

                <label className="text-xs text-slate-300 cursor-pointer">
                  <span className="px-3 py-1.5 rounded-full border border-slate-500 hover:border-indigo-500 hover:text-indigo-300 transition">
                    Choose Image
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
                <p className="mt-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="mt-5 space-y-3">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Uploading..." : "UPLOAD NEW AVATAR"}
                </button>

                {user.avatar && (
                  <button
                    onClick={handleRemove}
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "Removing..." : "REMOVE CURRENT AVATAR"}
                  </button>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  className="text-xs text-slate-400 hover:text-slate-200 transition"
                  onClick={onClose}
                  disabled={loading}
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
