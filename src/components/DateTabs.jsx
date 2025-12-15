const DateTabs = ({ value, onChange }) => {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex gap-3 overflow-x-auto">
      {days.map((d) => {
        const isActive = d.toDateString() === value.toDateString();
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`px-4 py-2 rounded-xl ${
              isActive
                ? "bg-[#FF7A1A] text-black"
                : "bg-[#151515] text-white"
            }`}
          >
            {d.toDateString().slice(0, 10)}
          </button>
        );
      })}
    </div>
  );
};

export default DateTabs;
