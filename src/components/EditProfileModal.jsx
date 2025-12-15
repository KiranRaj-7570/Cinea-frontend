import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "../api/axios";

const EditProfileModal = ({ isOpen, onClose, onSuccess, user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setBio(user.bio || "");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/auth/me", { name, bio });
      onUpdate(res.data.user);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
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
            <Dialog.Panel className="bg-[#151515] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
              <Dialog.Title className="text-xl font-semibold text-white">
                Edit Profile
              </Dialog.Title>

              <p className="text-xs text-slate-400 mt-1">
                Update how you appear on Cinéa
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* NAME */}
                <div>
                  <label className="text-xs text-slate-300">Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 bg-[#111] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-orange-400 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* BIO */}
                <div>
                  <label className="text-xs text-slate-300">Bio</label>
                  <textarea
                    className="w-full mt-1 bg-[#111] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-orange-400 outline-none resize-none"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Your movie taste, in a line or two…"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    className="px-5 py-2 text-xs font-semibold rounded-full bg-orange-500 hover:bg-orange-600 transition disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProfileModal;
