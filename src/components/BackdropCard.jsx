import { StarIcon } from "lucide-react";

const IMG = "https://image.tmdb.org/t/p/w780";

const BackdropCard = ({ item, onClick }) => {
  const title = item.name || item.title;
  const year =
    item.first_air_date?.slice(0, 4) ||
    item.release_date?.slice(0, 4) ||
    "—";

  return (
    <div
      className="cursor-pointer w-[280px] md:w-[340px] group"
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
          src={
            item.backdrop_path
              ? `${IMG}${item.backdrop_path}`
              : "/no-backdrop.png"
          }
          alt={title}
          className="w-full h-[150px] md:h-[190px] object-cover"
        />

        <div className="p-2">
          <p className="text-sm md:text-xl anton text-[#222] truncate">
            {title}
          </p>
          <p className="text-xs md:text-sm text-[#222] poppins-regular">{year}</p>
          <p className="text-xs md:text-sm text-[#222] antonio">
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

export default BackdropCard;