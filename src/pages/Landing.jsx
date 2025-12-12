import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyCinea from "../components/WhyCinea";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/home" replace />;
  }
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <Navbar />

      <Hero />

      <WhyCinea />

      <Footer />
    </div>
  );
};

export default Landing;
