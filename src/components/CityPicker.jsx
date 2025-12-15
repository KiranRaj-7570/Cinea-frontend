const CityPicker = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#151515] border border-white/10 px-4 py-2 rounded-xl"
    >
      <option>Chennai</option>
      <option>Bangalore</option>
      <option>Mumbai</option>
      <option>Delhi</option>
    </select>
  );
};

export default CityPicker;
