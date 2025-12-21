const formatTime12h = (time) => {
  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 || 12;
  const period = h >= 12 ? "PM" : "AM";
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
};

const ShowTimeButton = ({ show, onClick }) => {
  const seats = show.availableSeats;

  const isFull = seats === 0;
  const isLow = seats > 0 && seats <= 30;

  const base =
    "px-1.5 py-1.5 rounded-[9px] border-3 md:px-1 md:py-1 md:rounded-[14px] md:border-4 transition reem-kufi text-xl w-fixed text-center";

  const styles = isFull
    ? "border-gray-600 text-gray-500 cursor-not-allowed bg-[#0f0f0f]"
    : isLow
    ? "border-[#FF7A1A] text-black bg-[#F6E7C6] hover:bg-[#FF7A1A] hover:text-[#F6E7C6]"
    : "border-[#22c55e] text-black bg-[#F6E7C6] hover:bg-[#FF7A1A] hover:border-[#FF7A1A] hover:text-[#F6E7C6]";

  return (
    <button
      disabled={isFull}
      onClick={!isFull ? onClick : undefined}
      className={`${base} ${styles}`}
      title={
        isFull
          ? "Sold out"
          : isLow
          ? "Fast filling"
          : "Seats available"
      }
    >
      {formatTime12h(show.time)}
    </button>
  );
};

export default ShowTimeButton;
