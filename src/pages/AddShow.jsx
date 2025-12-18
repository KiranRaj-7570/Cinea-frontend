import { useEffect, useState } from "react";
import api from "../api/axios";

const AddShow = () => {
  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [date, setDate] = useState("");

  // 👇 MULTIPLE TIMES
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);

  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [priceMap, setPriceMap] = useState({});

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    const res = await api.get("/admin/theatres");
    setTheatres(res.data);
  };

  const handleTheatreChange = (id) => {
    setTheatreId(id);
    const t = theatres.find((x) => x._id === id);
    setSelectedTheatre(t);
    setScreenNumber("");
    setPriceMap({});
  };

  const handleScreenChange = (screenNo) => {
    setScreenNumber(Number(screenNo));

    const screen = selectedTheatre.screens.find(
      (s) => s.screenNumber === Number(screenNo)
    );

    const map = {};
    screen.seatLayout.rows.forEach((r) => {
      map[r.row] = r.price;
    });

    setPriceMap(map);
  };

  const updatePrice = (row, value) => {
    setPriceMap((prev) => ({
      ...prev,
      [row]: Number(value),
    }));
  };

  // ➕ add time
  const addTime = () => {
    if (!timeInput || times.includes(timeInput)) return;
    setTimes((prev) => [...prev, timeInput]);
    setTimeInput("");
  };

  // ❌ remove time
  const removeTime = (t) => {
    setTimes((prev) => prev.filter((x) => x !== t));
  };

  const handleSubmit = async () => {
    if (Object.keys(priceMap).length === 0) {
      alert("Please configure seat prices");
      return;
    }

    if (times.length === 0) {
      alert("Add at least one show time");
      return;
    }

    try {
      await api.post("/admin/shows", {
        movieId: Number(movieId),
        theatreId,
        screenNumber,
        date,
        times, // 👈 MULTIPLE TIMES
        language: "English",
        format: "2D",
        priceMap,
      });

      alert("Shows created successfully");

      setMovieId("");
      setTheatreId("");
      setScreenNumber("");
      setDate("");
      setTimes([]);
      setSelectedTheatre(null);
      setPriceMap({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create show");
    }
  };

  return (
    <div className="p-6 text-white max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add Show</h1>

      <input
        className="w-full mb-3 p-2 rounded bg-[#151515]"
        placeholder="TMDB Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
      />

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

      <input
        type="date"
        className="w-full mb-3 p-2 rounded bg-[#151515]"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 🕒 TIMES */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="p-2 bg-[#151515] rounded flex-1"
          />
          <button
            onClick={addTime}
            className="px-4 bg-[#FF7A1A] text-black rounded"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {times.map((t) => (
            <span
              key={t}
              onClick={() => removeTime(t)}
              className="px-3 py-1 bg-[#1c1c1c] rounded cursor-pointer text-sm"
            >
              {t} ✕
            </span>
          ))}
        </div>
      </div>

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
        Create Shows
      </button>
    </div>
  );
};

export default AddShow;
