

const ProfileHeader = ({
  name,
  bio,
  avatar,
  followersCount = 0,
  followingCount = 0,
  onEdit,
  onAvatar,
  isOwnProfile,
  isFollowing,
  onFollowToggle
}) => {

  const initials = name
    ? name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="relative w-full bg-orange-500">
      {/* Compact header background */}
      <div className="h-[180px] w-full bg-orange-500" />

      <div className="max-w-6xl mx-auto px-6 -mt-14 pb-6 relative">
        <div className="flex justify-between items-start">

          {/* LEFT SECTION */}
          <div className="flex gap-10">
            {/* Avatar + name/bio BELOW */}
            <div>
              {/* Avatar */}
              <div className="h-28 w-28 rounded-full bg-[#222222] p-[3px] shadow-lg ">
                <div
  onClick={isOwnProfile ? onAvatar : undefined}
  className={`h-full w-full rounded-full bg-black overflow-hidden flex items-center justify-center
    ${isOwnProfile ? "cursor-pointer" : "cursor-default"}
  `}
>
                  {avatar ? (
                    <img
                      src={avatar}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#F6E7C6]">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-[#222222] mt-4 ml-5 leading-none">
                {name}
              </h1>

              {/* Bio */}
              {bio && (
                <p className="text-sm text-[#222222] mt-2 ml-5 max-w-[260px] leading-snug">
                  {bio}
                </p>
              )}
            </div>

            {/* Followers / Following — NEXT TO NAME (with gap) */}
            <div className="flex items-start gap-12 ml-18 mt-10">
              <div className="flex items-baseline gap-2 cursor-pointer">
                <span className="text-5xl  text-[#222222] antonio">
                  {followersCount}
                </span>
                <span className="text-lg text-[#222222]  reem-kufi font-medium">
                  Followers
                </span>
              </div>

              <div className="flex items-baseline gap-2 cursor-pointer">
                <span className="text-5xl text-[#222222] antonio">
                  {followingCount}
                </span>
                <span className="text-lg text-[#222222] reem-kufi font-medium">
                  Following
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit profile */}
          {isOwnProfile ? (
  <button onClick={onEdit}>Edit profile</button>
) : (
  <button
    onClick={onFollowToggle}
    className={`px-5 py-2 rounded-full font-semibold shadow-md -mr-20 mt-2
      ${isFollowing
        ? "bg-[#222222] text-[#F6E7C6]"
        : "bg-[#FF7A1A] text-black"}
    `}
  >
    {isFollowing ? "Following" : "Follow"}
  </button>
)}

        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
