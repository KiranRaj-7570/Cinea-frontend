import defaultAvatar from "../assets/avatar.png";
import GoBackButton from "./GoBackButton";

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
  onFollowToggle,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <header className="relative w-full bg-orange-500 ">
      <GoBackButton />
      {/* Compact header background */}
      <div className="h-[180px] sm:h-[180px] md:h-[180px] w-full bg-orange-500" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:-mt-32 -mt-40 pb-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
          {/* LEFT SECTION */}
          <div className="flex flex-col gap-6 w-full md:w-auto">
            {/* Avatar + name/bio section */}
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {/* Avatar */}
              <div className="flex-shrink-0">
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
                      <img
                        src={defaultAvatar}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Name and Bio */}
              <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                <h1 className="text-2xl font-bold text-[#222222] leading-none">
                  {name}
                </h1>

                {/* Bio */}
                {bio && (
                  <p className="text-sm text-[#222222] mt-2 leading-relaxed">
                    {bio}
                  </p>
                )}
              </div>
            </div>

            {/* Followers / Following / Follow Button */}
            <div className="flex items-end gap-6 md:gap-12 w-full">
              <div
                className="flex items-baseline gap-2 cursor-pointer"
                onClick={onFollowersClick}
              >
                <span className="text-4xl sm:text-5xl text-[#222222] antonio">
                  {followersCount}
                </span>
                <span className="text-sm sm:text-lg text-[#222222] reem-kufi font-medium">
                  Followers
                </span>
              </div>

              <div
                className="flex items-baseline gap-2 cursor-pointer"
                onClick={onFollowingClick}
              >
                <span className="text-4xl sm:text-5xl text-[#222222] antonio">
                  {followingCount}
                </span>
                <span className="text-sm sm:text-lg text-[#222222] reem-kufi font-medium">
                  Following
                </span>
              </div>

              {/* Follow Button (aligned with stats) */}
              {!isOwnProfile && (
                <button
                  onClick={onFollowToggle}
                  className={`px-5 py-2 rounded-full font-semibold shadow-lg transition ml-auto h-fit
                    ${isFollowing
                      ? "bg-[#222222] text-[#F6E7C6]"
                      : "bg-[#F6E7C6] text-black"
                    }
                  `}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Edit profile */}
          {isOwnProfile && (
            <button
              onClick={onEdit}
              className="ml-5 bg-[#222222] text-[#F6E7C6] rounded-full hover:text-orange-500 px-2.5 py-1"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
