import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import EditProfileModal from "../components/EditProfileModal";
import AvatarModal from "../components/AvatarModal";
import { useContext, useState } from "react";

const Profile = () => {
  const { user, loginUser } = useContext(AuthContext);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const { name, email, bio, avatar, followers, following } = user;

  const getInitials = () => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 tracking-wide">Your Profile</h1>

        {/* Profile Card */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div
              className="h-32 w-32 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition"
              onClick={() => setIsAvatarOpen(true)}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white/80">
                  {getInitials()}
                </span>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-1">{name}</h2>
              <p className="text-slate-400 text-sm mb-4">{email}</p>

              <button
                onClick={() => setIsEditOpen(true)}
                className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
              >
                Edit Profile
              </button>

              {/* Stats */}
              <div className="flex gap-10 mt-6">
                <div className="text-center">
                  <p className="text-xl font-bold">{followers?.length || 0}</p>
                  <p className="text-xs text-slate-400 uppercase">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{following?.length || 0}</p>
                  <p className="text-xs text-slate-400 uppercase">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            {bio ? (
              <p className="text-sm text-slate-200">{bio}</p>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No bio added yet — click "Edit Profile" to add one.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        onUpdate={loginUser}
      />

      <AvatarModal
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        user={user}
        onUpdate={loginUser}
      />
    </div>
  );
};

export default Profile;
