import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo with ticket icon */}
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-indigo-600"
          >
            <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/>
            <path d="M6 10V8"/>
            <path d="M6 14v1"/>
            <path d="M6 19v2"/>
            <rect x="2" y="8" width="20" height="13" rx="2"/>
          </svg>
          <span className="text-xl font-bold text-gray-800">Ticksy</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-gray-600 hover:text-indigo-600 font-medium">
            Features
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium">
            How It Works
          </Link>
          <Link to="/faqs" className="text-gray-600 hover:text-indigo-600 font-medium">
            FAQs
          </Link>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Login
          </Link>
          <Link 
            to="/events" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Events »
          </Link>
        </div>

        {/* Mobile menu button (hidden for now) */}
        <button className="md:hidden text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;