import { useState } from "react";
import api from "../api/axios";
import ScreenEditor from "../components/ScreenEditor";

const AddTheatre = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [screens, setScreens] = useState([]);

  const handleSubmit = async () => {
    if (!name || !city || screens.length === 0) {
      alert("Fill all theatre details");
      return;
    }

    try {
      await api.post("/admin/theatres", {
        name,
        city,
        screens,
      });

      alert("Theatre added successfully");
      setName("");
      setCity("");
      setScreens([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-6 text-white max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Add Theatre</h1>

      <input
        className="block w-full mb-3 p-2 bg-[#151515] rounded"
        placeholder="Theatre Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="block w-full mb-4 p-2 bg-[#151515] rounded"
        placeholder="City (eg: Chennai)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <ScreenEditor screens={screens} setScreens={setScreens} />

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-[#FF7A1A] text-black rounded font-semibold"
      >
        Save Theatre
      </button>
    </div>
  );
};

export default AddTheatre;
