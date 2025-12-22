import { useNavigate } from "react-router-dom";

const ActivityCard = ({ item }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(
      item.mediaType === "tv"
        ? `/series/${item.tmdbId}`
        : `/movie/${item.tmdbId}`
    );
  };

  return (
    <div className="min-w-[200px] max-w-[200px] h-[330px] bg-[#F6E7C6] border border-white/10 rounded-2xl p-3 flex flex-col justify-between shrink-0">
      <img
        draggable={false}
        src={item.poster}
        alt={item.title}
        onClick={goToDetails}
        className="w-full h-[220px] rounded-xl object-cover bg-transparent cursor-pointer"
      />

      <p className="mt-2 text-sm text-[#222] anton md:text-lg truncate">
        {item.title}
      </p>

      <button
        onClick={goToDetails}
        className="mt-3 w-full py-1.5 rounded-full bg-[#1c1c1c] reem-kufi text-[#F6E7C6] border border-white/10 text-xs hover:bg-[#FF7A1A] hover:border-[#FF7A1A]/60 transition"
      >
        {item.cta || "View"}
      </button>
    </div>
  );
};

export default ActivityCard;
