import { useState } from "react";
import api from "../api/axios";
import ScreenEditor from "../components/ScreenEditor";

const AddTheatre = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Chennai");
  const [screens, setScreens] = useState([]);

  const handleSubmit = async () => {
    try {
      await api.post("/admin/theatres", {
        name,
        city,
        screens,
      });
      alert("Theatre added successfully");
      setName("");
      setScreens([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Add Theatre</h1>

      <input
        className="block mb-3 p-2 bg-[#151515]"
        placeholder="Theatre Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="block mb-4 p-2 bg-[#151515]"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option>Chennai</option>
        <option>Bangalore</option>
        <option>Mumbai</option>
      </select>

      <ScreenEditor screens={screens} setScreens={setScreens} />

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-[#FF7A1A] text-black rounded"
      >
        Save Theatre
      </button>
    </div>
  );
};

export default AddTheatre;
