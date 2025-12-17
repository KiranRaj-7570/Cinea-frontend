import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CityPicker from "../components/CityPicker";
import DateTabs from "../components/DateTabs";
import TheatreCard from "../components/TheatreCard";
import api from "../api/axios";

const BookShowPage = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateFromUrl = searchParams.get("date");
  const cityFromUrl = searchParams.get("city");
  const [dateHasShows, setDateHasShows] = useState({});
  const [movie, setMovie] = useState(null);
  const [city, setCity] = useState(cityFromUrl || "Chennai");
  const normalizeDate = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const [date, setDate] = useState(
    dateFromUrl ? normalizeDate(dateFromUrl) : normalizeDate(new Date())
  );
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    loadMovie();
  }, [movieId]);
  useEffect(() => {
    setDateHasShows({});
  }, [city, movieId]);
  useEffect(() => {
    loadShows();
  }, [city, date]);

  const loadMovie = async () => {
    const res = await api.get(`/movies/details/${movieId}`);
    setMovie(res.data);
  };

  const loadShows = async () => {
  const formattedDate = date.toLocaleDateString("en-CA");

  const res = await api.get(
    `/shows/movie/${movieId}?city=${city}&date=${formattedDate}`
  );

  setTheatres(res.data);

  // 🔥 ONLY mark false if empty
  setDateHasShows((prev) => {
    if (res.data.length === 0) {
      return { ...prev, [formattedDate]: false };
    }
    return prev;
  });
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
