const ShowTimeButton = ({ show, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-[#FF7A1A]
                 text-[#FF7A1A] hover:bg-[#FF7A1A] hover:text-black"
    >
      {show.time} • {show.language}
    </button>
  );
};

export default ShowTimeButton;