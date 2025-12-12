import React from "react";

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
          rounded-xl overflow-hidden bg-[#181818] border border-slate-800
          shadow-lg transition-all duration-300 transform
          group-hover:border-[#FF7A1A]
          group-hover:shadow-[0px_0px_9px_0px_rgba(255,122,26,1)]
        "
      >
        <img
          src={item.poster_path ? `${IMG}${item.poster_path}` : "/no-poster.png"}
          alt={title}
          className="w-full h-[220px] md:h-60 object-cover"
        />

        <div className="p-2">
          <p className="text-sm font-semibold text-[#F6E7C6] truncate">
            {title}
          </p>
          <p className="text-xs text-slate-400 ">{year}</p>
          <p className="text-xs text-yellow-400 ">
            ⭐ {item.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;