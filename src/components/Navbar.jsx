import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#9747FF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/>
            <path d="M6 10V8"/>
            <path d="M6 14v1"/>
            <path d="M6 19v2"/>
            <rect x="2" y="8" width="20" height="13" rx="2"/>
          </svg>
          <span className="text-2xl font-extrabold text-[#9747FF] tracking-tight">Ticksy</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-[#9747FF] font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-[#9747FF] font-medium">
            How It Works
          </a>
          <a href="#faqs" className="text-gray-600 hover:text-[#9747FF] font-medium">
            FAQs
          </a>
          <Link to="/login" className="text-[#9747FF] hover:text-[#8038D0] font-medium">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-[#9747FF] text-white px-4 py-2 rounded-md hover:bg-[#8038D0] transition-colors font-medium"
          >
            Register »
          </Link>
        </div>

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
