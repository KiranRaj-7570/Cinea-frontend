import ShowTimeButton from "./ShowTimeButton";

const TheatreCard = ({ theatre, onSelectShow }) => {
  const sortedShows = [...theatre.shows].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <div className="bg-transparent p-5">
      {/* 🎭 Theatre Name */}
      <h3 className="text-3xl text-[#F6E7C6] reem-kufi mb-6">
        {theatre.theatreName}
      </h3>

      {/* 🕒 Showtimes layout */}
      <div className="flex">
        {/* LEFT HALF */}
        <div className="w-full md:w-2/5">
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              gap-x-4
              gap-y-4
            "
          >
            {sortedShows.map((show) => (
              <ShowTimeButton
                key={show.showId}
                show={show}
                onClick={() => onSelectShow(show.showId)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT HALF (intentionally empty for now) */}
        <div className="hidden md:block w-1/2" />
      </div>
    </div>
  );
};

export default TheatreCard;
