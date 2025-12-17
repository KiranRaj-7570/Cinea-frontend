import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CityPicker from "../components/CityPicker";
import DateTabs from "../components/DateTabs";


const BookMoviesPage = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("Chennai");
  const [date, setDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedDate = date.toLocaleDateString("en-CA");
  useEffect(() => {
    loadMovies();
  }, [city, date]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const formattedDate = date.toLocaleDateString("en-CA");
      const res = await api.get(
        `/book/movies?city=${city}&date=${formattedDate}`
      );
      setMovies(res.data);
    } catch (err) {
      console.error("Load book movies error", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-[#111] text-white">
      <Navbar />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <h1 className="text-3xl font-bold mb-2">Movies Playing Now</h1>
        <p className="text-slate-400">
          Book tickets for movies currently running in theatres
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-4">
        <CityPicker value={city} onChange={setCity} />
        <DateTabs value={date} onChange={setDate} />
      </div>

      {/* MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {loading && <p className="text-slate-400">Loading movies...</p>}

        {!loading && movies.length === 0 && (
          <p className="text-slate-400">
            No movies available for booking in this city on this date.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              onClick={() =>
                navigate(
                  `/book/${movie.movieId}?date=${selectedDate}&city=${city}`
                )
              }
              className="cursor-pointer group"
            >
              {/* POSTER */}
              <div className="rounded-xl overflow-hidden bg-[#151515]">
                <img
                  src={
                    movie.poster
                      ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                      : "/no-poster.png"
                  }
                  alt={movie.title}
                  className="w-full h-[280px] object-cover group-hover:scale-105 transition"
                />
              </div>

              {/* INFO */}
              <div className="mt-3">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {movie.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  ⭐ {movie.rating?.toFixed(1) || "N/A"}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {movie.languages.join(", ")} • {movie.formats.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookMoviesPage;
