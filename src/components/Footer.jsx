import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 px-6 font-poppins border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[#9747FF] mb-4">Ticksy</h2>
            <p className="text-gray-600 mb-2">
              Your go-to platform for booking tickets to concerts, sports events, and festivals — easy, fast, and secure.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              © 2025 Ticksy. All rights reserved.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-[#5B1FBF] mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-[#9747FF]">About us</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-[#9747FF]">Services</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-[#9747FF]">Pricing</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#9747FF]">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-[#5B1FBF] mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-gray-600 hover:text-[#9747FF]">Terms of Service</Link></li>
              <li><Link to="/agreement" className="text-gray-600 hover:text-[#9747FF]">User Agreement</Link></li>
              <li><Link to="/refunds" className="text-gray-600 hover:text-[#9747FF]">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Contacts + Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-6 border-gray-200">
          {/* Contacts */}
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            <p>Phone: +284 71234567</p>
            <p>Email: <a href="mailto:services@ticksy.com" className="hover:text-[#9747FF]">services@ticksy.com</a></p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-5 text-xl text-gray-500">
            <a href="#" aria-label="Instagram" className="hover:text-[#9747FF]"><FaInstagram /></a>
            <a href="#" aria-label="Facebook" className="hover:text-[#9747FF]"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter" className="hover:text-[#9747FF]"><FaTwitter /></a>
            <a href="#" aria-label="TikTok" className="hover:text-[#9747FF]"><FaTiktok /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
