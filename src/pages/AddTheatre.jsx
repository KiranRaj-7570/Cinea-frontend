import { useState } from "react";
import api from "../api/axios";
import ScreenEditor from "../components/ScreenEditor";
import { Plus } from "lucide-react";

const AddTheatre = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  const showModal = (type, message) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: "", message: "" });
  };

  const handleSubmit = async () => {
    if (!name || !city || screens.length === 0) {
      showModal("error", "Fill all theatre details");
      return;
    }
    try {
      setLoading(true);
      await api.post("/admin/theatres", {
        name,
        city,
        screens,
      });
      showModal("success", "Theatre added successfully");
      setName("");
      setCity("");
      setScreens([]);
    } catch (err) {
      showModal("error", err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white w-full max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[#FF7A1A]">Add Theatre</h1>
    
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Theatre Name</label>
        <input
          className="w-full p-3 rounded-lg bg-[#151515] border border-slate-700 focus:border-[#FF7A1A] focus:outline-none transition"
          placeholder="e.g., PVR Cinemas"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">City</label>
        <input
          className="w-full p-3 rounded-lg bg-[#151515] border border-slate-700 focus:border-[#FF7A1A] focus:outline-none transition"
          placeholder="e.g., Trivandrum"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
 
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3">Screens</label>
        <ScreenEditor screens={screens} setScreens={setScreens} />
      </div>
 
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 bg-[#FF7A1A] hover:bg-orange-500 disabled:bg-slate-600 text-black rounded-lg font-bold flex items-center justify-center gap-2 transition"
      >
        <Plus size={20} /> {loading ? "Saving..." : "Save Theatre"}
      </button>

      {modal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#151515] border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  modal.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <h2 className="text-lg font-bold">
                {modal.type === "success" ? "Success" : "Error"}
              </h2>
            </div>
            <p className="text-slate-300 mb-6">{modal.message}</p>
            <button
              onClick={closeModal}
              className="w-full px-4 py-2 bg-[#FF7A1A] hover:bg-orange-500 text-black rounded-lg font-semibold transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTheatre;