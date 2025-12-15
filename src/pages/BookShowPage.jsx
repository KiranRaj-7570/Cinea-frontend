import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CityPicker from "../components/CityPicker";
import DateTabs from "../components/DateTabs";
import TheatreCard from "../components/TheatreCard";
import api from "../api/axios";

const BookShowPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [city, setCity] = useState("Chennai");
  const [date, setDate] = useState(new Date());
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  useEffect(() => {
    loadShows();
  }, [city, date]);

  const loadMovie = async () => {
    const res = await api.get(`/movies/details/${movieId}`);
    setMovie(res.data);
  };

  const loadShows = async () => {
    const formattedDate = date.toISOString().split("T")[0]; // ✅ YYYY-MM-DD

    const res = await api.get(
      `/shows/movie/${movieId}?city=${city}&date=${formattedDate}`
    );

    setTheatres(res.data);
  };
  useEffect(() => {
    console.log("Theatres:", theatres);
  }, [theatres]);

  if (!movie) return null;

  return (
    <div className="min-h-screen pt-16 bg-[#111] text-white">
      <Navbar />

      {/* MOVIE INFO */}
      <div className="max-w-6xl mx-auto px-6 mt-6 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="text-slate-400 mt-1">
          ⭐ {movie.rating} • {movie.duration}
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-6 mt-6 space-y-4">
        <CityPicker value={city} onChange={setCity} />
        <DateTabs value={date} onChange={setDate} />
      </div>

      {/* THEATRES */}
      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6">
        {theatres.map((theatre) => (
          <TheatreCard
  key={theatre.theatreId}
  theatre={theatre}
  onSelectShow={(showId) =>
    navigate(`/book/${movieId}/seats/${showId}`)
  }
/>
        ))}
      </div>
    </div>
  );
};

export default BookShowPage;
