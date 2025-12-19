import { useEffect, useState } from "react";
import api from "../api/axios";
import { X, Plus } from "lucide-react";

const AddShow = () => {
  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [screenNumber, setScreenNumber] = useState("");

  // 👇 MULTIPLE DATES
  const [dateInput, setDateInput] = useState("");
  const [dates, setDates] = useState([]);

  // 👇 MULTIPLE TIMES
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);

  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [priceMap, setPriceMap] = useState({});
  const [loading, setLoading] = useState(false);

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

  // ➕ add date
  const addDate = () => {
    if (!dateInput || dates.includes(dateInput)) return;
    setDates((prev) => [...prev, dateInput].sort());
    setDateInput("");
  };

  // ❌ remove date
  const removeDate = (d) => {
    setDates((prev) => prev.filter((x) => x !== d));
  };

  // ➕ add time
  const addTime = () => {
    if (!timeInput || times.includes(timeInput)) return;
    setTimes((prev) => [...prev, timeInput].sort());
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

    if (dates.length === 0) {
      alert("Add at least one date");
      return;
    }

    try {
      setLoading(true);

      // Create shows for each date
      for (const date of dates) {
        await api.post("/admin/shows", {
          movieId: Number(movieId),
          theatreId,
          screenNumber,
          date,
          times,
          language: "English",
          format: "2D",
          priceMap,
        });
      }

      alert(`Shows created successfully for ${dates.length} date(s)`);

      setMovieId("");
      setTheatreId("");
      setScreenNumber("");
      setDates([]);
      setTimes([]);
      setSelectedTheatre(null);
      setPriceMap({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white w-full max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-[#FF7A1A]">Add Show</h1>

      {/* MOVIE ID */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">TMDB Movie ID</label>
        <input
          className="w-full p-3 rounded-lg bg-[#151515] border border-slate-700 focus:border-[#FF7A1A] focus:outline-none transition"
          placeholder="e.g., 550"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        />
      </div>

      {/* THEATRE */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Theatre</label>
        <select
          className="w-full p-3 rounded-lg bg-[#151515] border border-slate-700 focus:border-[#FF7A1A] focus:outline-none transition"
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
      </div>

      {/* SCREEN */}
      {selectedTheatre && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Screen</label>
          <select
            className="w-full p-3 rounded-lg bg-[#151515] border border-slate-700 focus:border-[#FF7A1A] focus:outline-none transition"
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
        </div>
      )}

      {/* DATES */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Dates</label>
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="p-3 bg-[#151515] border border-slate-700 rounded-lg flex-1 focus:border-[#FF7A1A] focus:outline-none transition"
          />
          <button
            onClick={addDate}
            className="px-4 bg-[#FF7A1A] hover:bg-orange-500 text-black rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {dates.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {dates.map((d) => (
              <span
                key={d}
                className="px-4 py-2 bg-[#1c1c1c] border border-slate-700 rounded-lg flex items-center gap-2 text-sm"
              >
                {new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <button
                  onClick={() => removeDate(d)}
                  className="hover:text-[#FF7A1A] transition"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* TIMES */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Show Times</label>
        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="p-3 bg-[#151515] border border-slate-700 rounded-lg flex-1 focus:border-[#FF7A1A] focus:outline-none transition"
          />
          <button
            onClick={addTime}
            className="px-4 bg-[#FF7A1A] hover:bg-orange-500 text-black rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {times.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {times.map((t) => (
              <span
                key={t}
                className="px-4 py-2 bg-[#1c1c1c] border border-slate-700 rounded-lg flex items-center gap-2 text-sm"
              >
                {t}
                <button
                  onClick={() => removeTime(t)}
                  className="hover:text-[#FF7A1A] transition"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PRICES */}
      {Object.keys(priceMap).length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">Row Prices</label>
          <div className="bg-[#151515] border border-slate-700 rounded-lg p-4 space-y-3">
            {Object.entries(priceMap).map(([row, price]) => (
              <div key={row} className="flex items-center gap-4">
                <span className="font-semibold w-12 text-[#FF7A1A]">Row {row}</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => updatePrice(row, e.target.value)}
                  className="p-2 w-32 bg-[#222] border border-slate-700 rounded focus:border-[#FF7A1A] focus:outline-none transition"
                />
                <span className="text-slate-400">₹</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-6 py-3 bg-[#FF7A1A] hover:bg-orange-500 disabled:bg-slate-600 text-black rounded-lg font-bold text-lg transition"
      >
        {loading ? "Creating Shows..." : "Create Shows"}
      </button>

      {dates.length > 0 && times.length > 0 && (
        <p className="text-sm text-slate-400 mt-4 text-center">
          Will create {dates.length} × {times.length} = {dates.length * times.length} shows
        </p>
      )}
    </div>
  );
};

export default AddShow;
