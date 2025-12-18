import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CityPicker from "../components/CityPicker";
import DateTabs from "../components/DateTabs";
import TheatreCard from "../components/TheatreCard";
import ShowTimeSkeleton from "../components/Skeletons/ShowTimeSkeleton";
import api from "../api/axios";
import Footer from "../components/Footer";
import GoBackButton from "../components/GoBackButton";

const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const BookShowPage = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dateFromUrl = searchParams.get("date");
  const cityFromUrl = searchParams.get("city");

  const [movie, setMovie] = useState(null);
  const [city, setCity] = useState(cityFromUrl || "Chennai");
  const [date, setDate] = useState(
    dateFromUrl ? normalizeDate(dateFromUrl) : normalizeDate(new Date())
  );

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  useEffect(() => {
    setTheatres([]);
    loadShows();
  }, [city, date]);

  const loadMovie = async () => {
    const res = await api.get(`/movies/details/${movieId}`);
    setMovie(res.data);
  };

  const loadShows = async () => {
    try {
      setLoading(true);
      const formattedDate = date.toLocaleDateString("en-CA");

      const res = await api.get(
        `/shows/movie/${movieId}?city=${city}&date=${formattedDate}`
      );

      setTheatres(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return null;

  return (
    <div className="min-h-screen pt-16 bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white">
      <Navbar />
<div className="flex-1 pb-24">
      {/* MOVIE INFO */}
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-4">
          <GoBackButton label="Go Back" />
        </div>
        <h1 className="text-4xl font-bold tracking-normal anton text-[#F6E7C6]">{movie.title}</h1>
        <p className="text-[#F6E7C6] mt-2 max-w-xl [word-spacing:0.1rem] poppins-regular">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"} •{" "}
          {movie.runtime ? `${movie.runtime} min` : ""}
        </p>
       
      </div>
 <div className="w-full h-[5px] bg-black/20 shadow-md mt-4" />
      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 bg-[#151515] border border-white/10 rounded-2xl p-4">
            <CityPicker value={city} onChange={setCity} />
            <DateTabs value={date} onChange={setDate} />
          </div>
        </div>

      {/* THEATRES */}
      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-6">
        {loading && (
          <>
            <ShowTimeSkeleton />
            <ShowTimeSkeleton />
            <ShowTimeSkeleton />
          </>
        )}

        {!loading && theatres.length === 0 && (
          <p className="text-slate-400 text-center mt-20">
            No shows available for this date.
          </p>
        )}

        {!loading &&
          theatres.map((theatre) => (
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
      <Footer />
    </div>
  );
};

export default BookShowPage;
