import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import api from "../api/axios";

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
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
      onClose();
    } catch (err) {
      console.log("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

    
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
            <Dialog.Panel
              className="bg-[#0B1120] border border-slate-700 rounded-2xl p-6 shadow-xl max-w-sm w-full"
            >
              <Dialog.Title className="text-xl font-semibold text-white tracking-wide">
                Edit Profile
              </Dialog.Title>

              <p className="text-xs text-slate-400 mt-1">
                Update your personal info on Cinéa ✨
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                
                <div>
                  <label className="text-xs text-slate-300">Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:border-indigo-500 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

           
                <div>
                  <label className="text-xs text-slate-300">Bio</label>
                  <textarea
                    className="w-full mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your movie taste..."
                  />
                </div>


             
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-500 transition"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-4 py-2 text-xs bg-indigo-500 hover:bg-indigo-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
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