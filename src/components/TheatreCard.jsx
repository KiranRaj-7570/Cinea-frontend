import ShowTimeButton from "./ShowTimeButton";

const TheatreCard = ({ theatre, onSelectShow }) => {
  console.log("Rendering TheatreCard for:", theatre.theatreName);
  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-5">
      <h3 className="text-lg font-semibold">
        {theatre.theatreName}
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">
        {theatre.shows.map((show) => (
          <ShowTimeButton
            key={show.showId}
            show={show}
            onClick={() => onSelectShow(show.showId)}
          />
        ))}
      </div>
    </div>
  );
};

export default TheatreCard;