import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/avatar.png";

const FriendReviewCard = ({ review }) => {
  const navigate = useNavigate();

  return (
    <div className="md:min-w-[260px] md:max-w-[260px] min-w-[230px] max-w-[230px] bg-[#F6E7C6] border border-white/10 rounded-2xl overflow-hidden shrink-0 hover:border-[#FF7A1A]/40 transition">
      <div className="relative md:h-[330px] h-[280px]">
        <img
          draggable={false}
          src={review.poster}
          alt={review.title}
          onClick={() =>
            navigate(
              review.mediaType === "tv"
                ? `/series/${review.tmdbId}`
                : `/movie/${review.tmdbId}`
            )
          }
          className="w-full h-full object-cover cursor-pointer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-sm text-[#222] poppins-regular leading-relaxed line-clamp-3">
          " {review.excerpt || "No review text"} "
        </p>

        <div
          onClick={() => navigate(`/profile/${review.reviewer.id}`)}
          className="flex items-center gap-3 cursor-pointer pt-2 border-t border-white/10"
        >
          <img
            src={review.reviewer.avatar || defaultAvatar}
            alt={review.reviewer.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm text-[#222] reem-kufi truncate">
              {review.reviewer.name}
            </p>
            <p className="text-xs text-black antonio tracking-widest">
              <StarIcon
                className="inline mr-1 border-0 outline-0 mb-1"
                size={14}
                md:size={24}
                color="#ff8636"
                fill="#ff8636"
              />{" "}
              {review.rating}/5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendReviewCard;
