const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded font-bold">
            AP
          </div>
          <span className="text-xl font-semibold text-gray-800">
            AP Constructions
          </span>
        </div>

        {/* Right: Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
            About
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
            Contact
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
