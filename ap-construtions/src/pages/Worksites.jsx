import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import WorksiteModal from "../components/WorksiteModal";
import { getWorksites } from "../services/worksiteService";
import { getClients } from "../services/clientService";
import { useNavigate } from "react-router-dom";

const Worksites = () => {
  const [worksites, setWorksites] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    const ws = await getWorksites();
    const cl = await getClients();
    setWorksites(ws);
    setClients(cl);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = worksites.filter((w) =>
    w.work_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Worksites</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            + Create Worksite
          </button>
        </div>

        <input
          placeholder="Search by worksite name..."
          className="w-full sm:w-1/3 border px-4 py-2 rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Worksite</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-t">
                  <td className="p-3">{w.work_name}</td>
                  <td className="p-3">{w.client_name}</td>
                  <td className="p-3">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="p-3">{w.start_date}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/worksites/${w.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No worksites found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WorksiteModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={loadData}
        clients={clients}
      />
    </>
  );
};

export default Worksites;
