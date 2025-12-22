import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to AP Constructions
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Manage your clients, workers, attendance, payroll, and reports
            from one powerful dashboard.
          </p>

          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
