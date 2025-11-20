import Navbar from "../components/Navbar";

import Hero from "../components/Hero";
import WhyCinea from "../components/WhyCinea";
import Testimonials from "../components/Testimonials";

const Landing = () => {
  return (
    <div className="relative py-24 min-h-screen w-full overflow-hidden bg-black">
      
      <Navbar />

      <Hero />

      <WhyCinea />

      <Testimonials />
    </div>
  );
};

export default Landing;
