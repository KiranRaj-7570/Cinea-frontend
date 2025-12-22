import { useNavigate } from "react-router-dom";

const BookedHeroCard = ({ item }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(
      item.mediaType === "tv"
        ? `/series/${item.tmdbId}`
        : `/movie/${item.tmdbId}`
    );
  };

  return (
   <div className="min-w-[85%] sm:min-w-[48%] lg:min-w-[46%] h-60 md:h-[260px] bg-[#0b0b0b] border border-white/10 rounded-3xl overflow-hidden relative flex">

      {/* BACKDROP */}
      <img
  draggable={false}
  src={item.backdrop}
  alt={item.title}
  className="absolute inset-0 w-full h-full object-cover opacity-30"
/>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-center px-6 md:px-10 w-full">
        {/* TITLE + RATING */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl md:text-3xl anton text-[#F6E7C6] tracking-wider uppercase">
            {item.title}
          </h3>

          {item.rating && (
            <div className="flex items-center gap-1 text-lg font-semibold text-[#FF7A1A]">
              {item.rating.toFixed(1)}
              <span>⭐</span>
            </div>
          )}
        </div>

        {/* COPY */}
        <p className="mt-4 text-sm md:text-base text-[#F6E7C6] max-w-md">
          Drop your review — help fellow cinemates discover it.
        </p>

        {/* CTA */}
        <button
          onClick={goToDetails}
          className="mt-6 w-fit px-6 py-2.5 rounded-full bg-[#FF7A1A] text-black font-semibold hover:bg-orange-600 transition"
        >
          Share Your Thoughts
        </button>
      </div>
    </div>
  );
};

export default BookedHeroCard;
