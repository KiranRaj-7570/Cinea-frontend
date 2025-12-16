import { useEffect, useState } from "react";
import api from "../api/axios";

const AddShow = () => {
  // basic show fields
  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // theatre data
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);

  // price map (row-wise)
  const [priceMap, setPriceMap] = useState({});

  useEffect(() => {
    loadTheatres();
  }, []);

  // fetch theatres from backend
  const loadTheatres = async () => {
    try {
      const res = await api.get("/admin/theatres");
      setTheatres(res.data);
    } catch (err) {
      alert("Failed to load theatres");
    }
  };

  // when theatre changes
  const handleTheatreChange = (id) => {
    setTheatreId(id);

    const theatre = theatres.find((t) => t._id === id);
    setSelectedTheatre(theatre);

    // reset screen + priceMap
    setScreenNumber("");
    setPriceMap({});
  };

  // when screen changes → auto-generate priceMap
  const handleScreenChange = (screenNo) => {
    setScreenNumber(Number(screenNo));

    const screen = selectedTheatre.screens.find(
      (s) => s.screenNumber === Number(screenNo)
    );

    const map = {};
    screen.seatLayout.rows.forEach((r) => {
      map[r.row] = r.price; // default price from theatre layout
    });

    setPriceMap(map);
  };

  // update individual row price
  const updatePrice = (row, value) => {
    setPriceMap((prev) => ({
      ...prev,
      [row]: Number(value),
    }));
  };

  // submit show
  const handleSubmit = async () => {
    try {
      await api.post("/admin/shows", {
        movieId: Number(movieId),
        theatreId,              // ✅ MongoDB ID auto-set
        screenNumber,
        date,
        time,
        language: "English",
        format: "2D",
        priceMap,
      });

      alert("Show created successfully");

      // reset form
      setMovieId("");
      setTheatreId("");
      setScreenNumber("");
      setDate("");
      setTime("");
      setSelectedTheatre(null);
      setPriceMap({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create show");
    }
  };

  return (
    <div className="p-6 text-white max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add Show</h1>

      {/* Movie ID */}
      <input
        className="w-full mb-3 p-2 rounded bg-[#151515]"
        placeholder="TMDB Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
      />

      {/* Theatre */}
      <select
        className="w-full mb-3 p-2 rounded bg-[#151515]"
        value={theatreId}
        onChange={(e) => handleTheatreChange(e.target.value)}
      >
        <option value="">Select Theatre</option>
        {theatres.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name} ({t.city})
          </option>
        ))}
      </select>

      {/* Screen */}
      {selectedTheatre && (
        <select
          className="w-full mb-3 p-2 rounded bg-[#151515]"
          value={screenNumber}
          onChange={(e) => handleScreenChange(e.target.value)}
        >
          <option value="">Select Screen</option>
          {selectedTheatre.screens.map((s) => (
            <option key={s.screenNumber} value={s.screenNumber}>
              Screen {s.screenNumber}
            </option>
          ))}
        </select>
      )}

      {/* Date */}
      <input
        type="date"
        className="w-full mb-3 p-2 rounded bg-[#151515]"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Time */}
      <input
        type="time"
        className="w-full mb-4 p-2 rounded bg-[#151515]"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* Price Map Editor */}
      {Object.keys(priceMap).length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Row Prices</h3>
          {Object.entries(priceMap).map(([row, price]) => (
            <div key={row} className="flex items-center gap-3 mb-2">
              <span className="w-6">{row}</span>
              <input
                type="number"
                value={price}
                onChange={(e) => updatePrice(row, e.target.value)}
                className="p-1 w-24 bg-[#151515] rounded"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-[#FF7A1A] text-black rounded font-semibold"
      >
        Create Show
      </button>
    </div>
  );
};

export default AddShow;
