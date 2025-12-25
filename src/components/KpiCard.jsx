const KpiCard = ({ label, value }) => {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="text-3xl font-bold text-[#F6E7C6]">
        {value}
      </h3>
    </div>
  );
};

export default KpiCard;
