import { useEffect, useState } from "react";
import api from "../api/axios";

const CityPicker = ({ value, onChange }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api.get("/admin/cities").then((res) => setCities(res.data));
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#151515] border border-white/10 px-3 py-2 rounded-xl"
    >
      {cities.map((c) => (
        <option key={c}>{c}</option>
      ))}
    </select>
  );
};

export default CityPicker;
