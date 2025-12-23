import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Dashboard
        </h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {/* Clients */}
          <button
            onClick={() => navigate("/clients")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <p className="text-sm text-slate-500">Manage</p>
            <p className="text-xl font-semibold text-slate-900">Clients</p>
          </button>

          {/* Workers */}
          <button
            onClick={() => navigate("/workers")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <p className="text-sm text-slate-500">Manage</p>
            <p className="text-xl font-semibold text-slate-900">Workers</p>
          </button>


           {/* Worksites */}
          <button
            onClick={() => navigate("/worksites")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <p className="text-sm text-slate-500">Manage</p>
            <p className="text-xl font-semibold text-slate-900">Worksites</p>
          </button>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
