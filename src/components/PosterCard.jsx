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
      className="cursor-pointer w-[150px] md:w-[180px] group"
      onClick={() => onClick(item)}
    >
      <div
        className="
          rounded-xl overflow-hidden bg-[#F6E7C6] border border-slate-800
          shadow-lg transition-all duration-300 transform
          group-hover:border-[#fff4c6]
        "
      >
        <img
          src={item.poster_path ? `${IMG}${item.poster_path}` : "/no-poster.png"}
          alt={title}
          className="w-full h-[220px] md:h-60 object-cover"
        />

        <div className="p-2">
          <p className="text-sm md:text-xl anton text-[#222] truncate">
            {title}
          </p>
          <p className="text-xs md:text-sm text-[#222] poppins-regular">{year}</p>
          <p className="text-xs md:text-sm text-[#222] antonio ">
            <StarIcon
                className="inline mr-1 border-0 outline-0 mb-1"
                size={14}
                md:size={24}
                color="#ff8636"
                fill="#ff8636"
              /> {item.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;