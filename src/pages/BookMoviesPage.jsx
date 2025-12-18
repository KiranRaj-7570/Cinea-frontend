import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CityPicker from "../components/CityPicker";
import DateTabs from "../components/DateTabs";
import { StarIcon } from "lucide-react";
import Footer from "../components/Footer";
import MovieCardSkeleton from "../components/Skeletons/MovieCardSkeleton";

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
    <div className="min-h-screen pt-16 bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white flex flex-col">
      <Navbar />

      {/* 🔹 PAGE CONTENT */}
      <div className="flex-1 pb-24">
        {/* HEADER */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <h1 className="text-4xl font-bold tracking-normal anton text-[#F6E7C6]">
            MOVIES PLAYING NOW
          </h1>
          <p className="text-[#F6E7C6] mt-2 max-w-xl [word-spacing:0.1rem] poppins-regular">
            Choose a movie running in theatres near you and book instantly
          </p>
        </div>

        {/* FULL WIDTH DIVIDER */}
        <div className="w-screen h-[5px] bg-black/20 shadow-md mt-5" />

        {/* FILTERS */}
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 bg-[#151515] border border-white/10 rounded-2xl p-4">
            <CityPicker value={city} onChange={setCity} />
            <DateTabs value={date} onChange={setDate} />
          </div>
        </div>

        {/* MOVIE GRID */}
        <div className="max-w-7xl mx-auto px-6 mt-10">
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-xl font-semibold">
                No movies playing on this date
              </h2>
              <p className="text-slate-400 mt-2 max-w-sm">
                Try selecting a different date or change your city.
              </p>
            </div>
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
                className="cursor-pointer group transition hover:border-[#FF7A1A] border rounded-2xl p-2"
              >
                <div className="relative rounded-2xl overflow-hidden bg-[#151515] shadow-lg">
                  <img
                    src={
                      movie.poster
                        ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                        : "/no-poster.png"
                    }
                    alt={movie.title}
                    className="w-full h-[280px] object-cover"
                  />
                </div>

                <div className="mt-4 space-y-1 p-2">
                  <h3 className="font-semibold text-base line-clamp-1">
                    {movie.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    <StarIcon
                      className="inline mr-1 mb-1"
                      size={15}
                      color="#ffd500"
                      fill="#ffd500"
                    />
                    {movie.rating?.toFixed(1) || "N/A"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {movie.languages.join(", ")} • {movie.formats.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 FOOTER */}
      <Footer />
    </div>
  );
};

export default BookMoviesPage;
