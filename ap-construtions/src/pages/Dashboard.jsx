import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const Card = ({ title, subtitle, icon, onClick, color }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow
                 hover:shadow-lg hover:-translate-y-1
                 transition-all duration-200 text-left
                 flex items-center gap-4"
    >
      <div
        className={`p-3 rounded-xl ${color} text-white shadow-md`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <p className="text-xl font-semibold text-slate-900">
          {title}
        </p>
      </div>
    </button>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Dashboard
        </h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

          {/* Clients */}
          <Card
            title="Clients"
            subtitle="Manage"
            color="bg-indigo-600"
            onClick={() => navigate("/clients")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 00-4-4h-1" />
                <path d="M9 20H4v-2a4 4 0 014-4h1" />
                <circle cx="9" cy="7" r="4" />
                <circle cx="17" cy="7" r="4" />
              </svg>
            }
          />

          {/* Workers */}
          <Card
            title="Workers"
            subtitle="Manage"
            color="bg-emerald-600"
            onClick={() => navigate("/workers")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a6.5 6.5 0 0113 0" />
              </svg>
            }
          />

          {/* Worksites */}
          <Card
            title="Worksites"
            subtitle="Manage"
            color="bg-orange-600"
            onClick={() => navigate("/worksites")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 21h18" />
                <path d="M6 21V7l6-4 6 4v14" />
              </svg>
            }
          />

          {/* Mark Attendance */}
          <Card
            title="Mark Attendance"
            subtitle="Daily Work"
            color="bg-blue-600"
            onClick={() => navigate("/attendance/mark")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            }
          />

          {/* Attendance List */}
          <Card
            title="Attendance List"
            subtitle="Records"
            color="bg-sky-600"
            onClick={() => navigate("/attendance")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            }
          />

          {/* Payroll */}
          <Card
            title="Payroll"
            subtitle="Finance"
            color="bg-purple-600"
            onClick={() => navigate("/payroll")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.5 0-3 .5-3 2s1.5 2 3 2 3 .5 3 2-1.5 2-3 2" />
                <path d="M12 6v12" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            }
          />

          {/* Expenses */}
          <Card
            title="Expenses"
            subtitle="Manage"
            color="bg-red-600"
            onClick={() => navigate("/expenses")}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1v22" />
                <path d="M17 5H9a3 3 0 000 6h6a3 3 0 010 6H6" />
              </svg>
            }
          />

        </div>
      </div>
    </>
  );
};

export default Dashboard;
