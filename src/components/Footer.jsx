import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { BiPaperPlane } from "react-icons/bi";
import Logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-[#0C0C0C] text-[#ffffff] pt-16 pb-8 px-6 hidden md:block mt-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

     
        <div>
          <img src={Logo} alt="Cinéa Logo" className="w-60 mb-6" />

          <div className="w-full h-px bg-white/20 opacity-40 mb-6" />

         
          <div className="flex items-start gap-10">
       
            <div>
              <h3 className="text-[#FF7A1A] font-semibold mb-3 reem-kufi">Follow us</h3>
              <div className="flex gap-4 text-xl">
                <FaFacebookF className="hover:text-[#FF7A1A] cursor-pointer transition" />
                <BiPaperPlane className="hover:text-[#FF7A1A] cursor-pointer transition" />
                <FaInstagram className="hover:text-[#FF7A1A] cursor-pointer transition" />
              </div>
            </div>

            
            <div>
              <h3 className="text-[#FF7A1A] font-semibold mb-3 reem-kufi">Call us</h3>
              <p className="text-sm opacity-80 reem-kufi">+1 800 854-36-80</p>
            </div>

          </div>
        </div>

        <div>
          <h3 className="text-[#FF7A1A] font-semibold mb-4 reem-kufi">Product</h3>
          <ul className="space-y-2 opacity-90 text-sm reem-kufi">
            <li><Link to="#">Landing Page</Link></li>
            <li><Link to="#">Cookie Preferences</Link></li>
            <li><Link to="#">Web-design</Link></li>
            <li><Link to="#">Content</Link></li>
            <li><Link to="#">Integrations</Link></li>
          </ul>
        </div>

       
        <div>
          <h3 className="text-[#FF7A1A] font-semibold mb-4 reem-kufi">Use Cases</h3>
          <ul className="space-y-2 opacity-90 text-sm reem-kufi">
            <li><Link to="#">Web-designers</Link></li>
            <li><Link to="#">Marketers</Link></li>
            <li><Link to="#">Small Business</Link></li>
            <li><Link to="#">Website Builder</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="text-[#FF7A1A] font-semibold mb-4 reem-kufi">Company</h3>
          <ul className="space-y-2 opacity-90 text-sm reem-kufi">
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">FAQs</Link></li>
            <li><Link to="#">Teams</Link></li>
            <li><Link to="#">Contact Us</Link></li>
          </ul>
        </div>

      </div>

      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 flex flex-wrap justify-center gap-10 text-sm reem-kufi opacity-80">
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Terms of Use</Link>
        <Link to="#">Legal</Link>
        <Link to="#">Site Map</Link>
      </div>
    </footer>
  );
};

export default Footer;

