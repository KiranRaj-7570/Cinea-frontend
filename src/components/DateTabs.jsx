import { useEffect, useRef } from "react";

const DateTabs = ({ value, onChange }) => {
  const containerRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getLabel = (date, index) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    return date.toDateString().slice(0, 10);
  };

  // auto-scroll active date
  useEffect(() => {
    const active = containerRef.current?.querySelector(
      "[data-active='true']"
    );
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="flex gap-3 overflow-x-auto no-scrollbar poppins-regular"
    >
      {days.map((d, idx) => {
        const isActive = isSameDay(d, value);

        return (
          <button
            key={d.toISOString()}
            data-active={isActive}
            onClick={() => onChange(d)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition
              ${
                isActive
                  ? "bg-[#FF7A1A] text-black"
                  : "bg-[#151515] text-white hover:border-[#FF7A1A] hover:bg-[#1c1c1c]"
              }`}
          >
            {getLabel(d, idx)}
          </button>
        );
      })}
    </div>
  );
};

export default DateTabs;
