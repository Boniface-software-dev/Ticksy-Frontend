import React, { useState } from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  
  const checkScrollTop = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-[#F9F8FF] text-gray-800 font-poppins border-t border-gray-300 shadow-inner relative">
        <div className="max-w-7xl mx-auto py-12 px-6 w-full">
          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-8">
            {/* Branding */}
            <div className="md:col-span-1 lg:col-span-2">
              <h3 className="text-2xl font-bold text-[#9747FF] mb-4">Ticksy</h3>
              <p className="text-gray-600 mb-4">
                Your go-to platform for booking tickets to concerts, sports events,
                and festivals.
              </p>
              
              {/* Newsletter (Placeholder) */}
              <div className="mt-4">
                <p className="text-sm font-medium text-[#5B1FBF] mb-2">
                  Stay updated with our newsletter
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#9747FF] text-sm w-full"
                  />
                  <button className="bg-[#9747FF] text-white px-4 py-2 rounded-r-md hover:bg-[#7c3aed] transition text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-[#9747FF] hover:underline">About Us</button></li>
                <li><button className="hover:text-[#9747FF] hover:underline">Services</button></li>
                <li><button className="hover:text-[#9747FF] hover:underline">Pricing</button></li>
                <li><button className="hover:text-[#9747FF] hover:underline">Careers</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-[#9747FF] hover:underline">Terms of Service</button></li>
                <li><button className="hover:text-[#9747FF] hover:underline">Privacy Policy</button></li>
                <li><button className="hover:text-[#9747FF] hover:underline">Refund Policy</button></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Contact</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li className="text-gray-600">+254 712 345 678</li>
                <li className="text-gray-600">
                  <button className="hover:text-[#9747FF] hover:underline">
                    services@ticksy.com
                  </button>
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-[#5B1FBF] mb-4">Follow Us</h4>
              <div className="flex space-x-4 text-xl">
                {[
                  { icon: <FaInstagram />, label: "Instagram" },
                  { icon: <FaFacebookF />, label: "Facebook" },
                  { icon: <FaTwitter />, label: "Twitter" },
                  { icon: <FaTiktok />, label: "TikTok" },
                ].map((social, index) => (
                  <button
                    key={index}
                    aria-label={social.label}
                    className="text-gray-600 hover:text-[#9747FF] transform hover:-translate-y-1 transition duration-200"
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ticksy. All rights reserved.
          </div>
        </div>

        {/* Back to Top Button */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 bg-[#9747FF] text-white p-3 rounded-full shadow-lg hover:bg-[#7c3aed] transition transform hover:scale-110 z-50"
          >
            <FaArrowUp />
          </button>
        )}
      </footer>
    </>
  );
};

export default Footer;