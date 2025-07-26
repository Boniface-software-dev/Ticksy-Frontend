import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 px-6 font-poppins w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          {/* Description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-[#9747FF]">Ticksy</h3>
            <p className="text-gray-600 mb-1">
              Your go-to platform for booking tickets to concerts, sports events,
              and festivals.
            </p>
            <p className="text-gray-600">
              We make ticket purchasing easy and secure.
            </p>
            <p className="text-gray-500 mt-6 text-sm">© Ticksy 2025</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#9747FF]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#9747FF]">About Us</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Services</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#9747FF]">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#9747FF]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">User Agreement</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contacts & Socials */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#9747FF]">Contact</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li className="text-gray-600">+254 712 345 678</li>
              <li className="text-gray-600">services@ticksy.com</li>
            </ul>

            <h4 className="font-semibold text-lg mb-4 text-[#9747FF]">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-600 hover:text-[#9747FF]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-600 hover:text-[#9747FF]"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-600 hover:text-[#9747FF]"
              >
                <FaTwitter />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-gray-600 hover:text-[#9747FF]"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
