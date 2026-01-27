import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { X, Plus } from "lucide-react";
import useDebounce from "../hooks/useDebounce";

const AddShow = () => {
  const [movieId, setMovieId] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebounce(searchValue, 300);
  const dropdownRef = useRef(null);

  const [theatreId, setTheatreId] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dates, setDates] = useState([]);
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [priceMap, setPriceMap] = useState({});
  const [loading, setLoading] = useState(false);


  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    const res = await api.get("/admin/theatres");
    setTheatres(res.data);
  };



  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await api.get(
          `/movies/search?query=${encodeURIComponent(debouncedQuery)}`
        );

        if (!cancelled) {
          setSuggestions(res.data.results?.slice(0, 6) || []);
          setShowDropdown(true);
        }
      } catch {
        setSuggestions([]);
      }
    };

    load();
    return () => (cancelled = true);
  }, [debouncedQuery]);

 
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


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

  const addDate = () => {
    if (!dateInput || dates.includes(dateInput)) return;
    setDates((prev) => [...prev, dateInput].sort());
    setDateInput("");
  };

  const removeDate = (d) => {
    setDates((prev) => prev.filter((x) => x !== d));
  };

  const addTime = () => {
    if (!timeInput || times.includes(timeInput)) return;
    setTimes((prev) => [...prev, timeInput].sort());
    setTimeInput("");
  };

  const removeTime = (t) => {
    setTimes((prev) => prev.filter((x) => x !== t));
  };

  const showModal = (type, message) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: "", message: "" });
  };

  const handleSubmit = async () => {
    if (!movieId) {
      showModal("error", "Select a movie");
      return;
    }

    if (!dates.length || !times.length || !Object.keys(priceMap).length) {
      showModal("error", "Missing show configuration");
      return;
    }

    try {
      setLoading(true);

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

      showModal("success", "Shows created successfully");

      setMovieId("");
      setMovieTitle("");
      setSearchValue("");
      setDates([]);
      setTimes([]);
      setSelectedTheatre(null);
      setPriceMap({});
    } catch (err) {
      showModal("error", err.response?.data?.message || "Failed to create show");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#FF7A1A]">Add Show</h1>

   
      <div className="mb-6 relative" ref={dropdownRef}>
        <label className="block text-sm font-semibold mb-2">
          Movie (TMDB)
        </label>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search movie..."
          className="w-full p-3 rounded-lg bg-[#151515] border  border-slate-700 focus:border-[#FF7A1A] focus:outline-none"
        />

        {movieTitle && (
          <p className="text-sm text-green-400 mt-1">
            Selected: {movieTitle}
          </p>
        )}

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-[72px] w-full bg-[#222] border border-slate-700 rounded-xl z-50">
            {suggestions.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setMovieId(m.id);
                  setMovieTitle(m.title);
                  setSearchValue(m.title);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-[#333] cursor-pointer text-sm"
              >
                {m.title}{" "}
                <span className="text-xs text-slate-400">
                  ({m.release_date?.slice(0, 4)})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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

      {/* MODAL */}
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

export default AddShow;