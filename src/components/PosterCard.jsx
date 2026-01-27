import { StarIcon } from "lucide-react";

const IMG = "https://image.tmdb.org/t/p/w342";

const PosterCard = ({ item, onClick }) => {
  const title = item.title || item.name;
  const year =
    item.release_date?.slice(0, 4) ||
    item.first_air_date?.slice(0, 4) ||
    "—";

  return (
    <div
      className="cursor-pointer w-full group"
      onClick={() => onClick(item)}
    >
      <div
        className="
          rounded-lg sm:rounded-xl overflow-hidden bg-[#F6E7C6] border border-slate-800
          shadow-lg transition-all duration-300 transform
          group-hover:border-[#fff4c6] group-hover:scale-105
        "
      >
        <img
          src={item.poster_path ? `${IMG}${item.poster_path}` : "/no-poster.png"}
          alt={title}
          className="w-full h-[150px] sm:h-[180px] md:h-[220px] lg:h-[260px] object-cover"
        />
        <div className="p-1 sm:p-1.5 md:p-2">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg anton text-[#222] truncate">
            {title}
          </p>
          <p className="text-xs md:text-sm text-[#222] poppins-regular">{year}</p>
          <p className="text-xs md:text-sm text-[#222] antonio flex items-center gap-1">
            <StarIcon
              className="flex-shrink-0"
              size={12}
              color="#ff8636"
              fill="#ff8636"
            />
            {item.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;