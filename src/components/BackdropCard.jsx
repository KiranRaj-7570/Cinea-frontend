import React from "react";

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
          rounded-xl overflow-hidden bg-[#181818] border border-slate-800
          shadow-lg transition-all duration-300 transform
          
          group-hover:shadow-[0px_0px_4px_0px_rgba(255,122,26,1)]
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
          <p className="text-sm font-semibold text-[#F6E7C6] truncate">
            {title}
          </p>
          <p className="text-xs text-slate-400">{year}</p>
          <p className="text-xs text-yellow-400">
            ⭐ {item.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackdropCard;