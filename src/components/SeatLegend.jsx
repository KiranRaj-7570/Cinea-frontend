const SeatLegend = () => {
  return (
    <div className="mt-6 flex justify-center md:justify-end gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-[#FF7A1A]" />
        <span className="text-slate-300">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm border border-[#555]" />
        <span className="text-slate-300">Available</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm bg-[#D6D6D6]" />
        <span className="text-slate-300">Sold</span>
      </div>
    </div>
  );
};

export default SeatLegend;
