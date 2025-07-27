import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F9F8FF] text-gray-800 font-poppins border-t border-gray-300 shadow-inner">
      <div className="max-w-7xl mx-auto py-12 px-6 w-full">
        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-[#9747FF] mb-4">Ticksy</h3>
            <p className="text-gray-600 mb-1">
              Your go-to platform for booking tickets to concerts, sports events,
              and festivals.
            </p>
            <p className="text-gray-600">
              We make ticket purchasing easy and secure.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              © 2025 Ticksy. All rights reserved.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#9747FF]">About Us</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Services</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#9747FF]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">User Agreement</a></li>
              <li><a href="#" className="hover:text-[#9747FF]">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Contact</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li className="text-gray-600">+254 712 345 678</li>
              <li className="text-gray-600">
                <a href="mailto:services@ticksy.com" className="hover:text-[#9747FF]">
                  services@ticksy.com
                </a>
              </li>
            </ul>

            <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-xl text-gray-600">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#9747FF]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#9747FF]"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter className="hover:text-[#9747FF]" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok className="hover:text-[#9747FF]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
