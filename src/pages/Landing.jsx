import Navbar from "../components/Navbar";

import Hero from "../components/Hero";
import WhyCinea from "../components/WhyCinea";
import Footer from "../components/Footer";

const Landing = () => {
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
