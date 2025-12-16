import { useEffect, useState } from "react";
import api from "../api/axios";

const ManageShows = () => {
  const [shows, setShows] = useState([]);

  const loadShows = async () => {
    const res = await api.get("/admin/shows");
    setShows(res.data);
  };

  const deleteShow = async (id) => {
    if (!window.confirm("Delete this show?")) return;
    await api.delete(`/admin/shows/${id}`);
    loadShows();
  };

  useEffect(() => {
    loadShows();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Shows</h1>

      {shows.length === 0 && (
        <p className="text-gray-400">No shows created yet.</p>
      )}

      <div className="space-y-3">
        {shows.map((show) => (
          <div
            key={show._id}
            className="bg-[#151515] border border-white/10 rounded-xl p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">
                Movie ID: {show.movieId}
              </p>
              <p className="text-sm text-gray-400">
                {show.theatreId.name} • Screen {show.screenNumber}
              </p>
              <p className="text-sm">
                {show.date} @ {show.time}
              </p>
            </div>

            <button
              onClick={() => deleteShow(show._id)}
              className="text-red-400 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageShows;
