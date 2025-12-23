import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import WorkerModal from "../components/WorkerModal";
import ConfirmDelete from "../components/ConfirmDelete";
import { getWorkers, deleteWorker } from "../services/workerService";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadWorkers = async () => {
    const data = await getWorkers();
    setWorkers(data);
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const filteredWorkers = workers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Workers</h1>

          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800"
          >
            + Add Worker
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search worker by name..."
          className="w-full sm:w-1/3 px-4 py-2 mb-4 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Worker Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Village</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Salary/Day</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w) => (
                <tr key={w.id} className="border-t">
                  <td className="p-3">{w.name}</td>
                  <td className="p-3">{w.village || "-"}</td>
                  <td className="p-3">{w.phone || "-"}</td>
                  <td className="p-3">
                    {w.salary
                        ? `₹${w.salary.full_day_rate} / ₹${w.salary.half_day_rate}`
                        : "-"}

                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setDeleteId(w.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No workers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <WorkerModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={loadWorkers}
      />

      <ConfirmDelete
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteWorker(deleteId);
          setDeleteId(null);
          loadWorkers();
        }}
      />
    </>
  );
};

export default Workers;
