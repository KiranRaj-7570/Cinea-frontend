import { useEffect, useState } from "react";
import api from "../api/axios";

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);

  const loadTheatres = async () => {
    const res = await api.get("/admin/theatres");
    setTheatres(res.data);
  };

  const deleteTheatre = async (id) => {
    if (!window.confirm("Deactivate this theatre?")) return;
    await api.delete(`/admin/theatres/${id}`);
    loadTheatres();
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Theatres</h1>

      {theatres.length === 0 && (
        <p className="text-gray-400">No theatres added yet.</p>
      )}

      <div className="space-y-3">
        {theatres.map((t) => (
          <div
            key={t._id}
            className="bg-[#151515] border border-white/10 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-400">{t.city}</p>
              <p className="text-sm mt-1">
                Screens: {t.screens.map((s) => s.screenNumber).join(", ")}
              </p>
            </div>

            <button
              onClick={() => deleteTheatre(t._id)}
              className="text-red-400 hover:text-red-500"
            >
              Deactivate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheatres;
