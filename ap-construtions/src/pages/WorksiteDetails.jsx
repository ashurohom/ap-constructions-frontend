import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-200 text-gray-700",
  COMPLETED: "bg-red-100 text-red-700",
};

const WorksiteDetails = () => {
  const { id } = useParams();

  const [worksite, setWorksite] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔄 Load data
  const loadData = async () => {
    try {
      const [wsRes, workersRes, assignedRes] = await Promise.all([
        axios.get(`${API_BASE}/worksites/${id}/`, authHeader()),
        axios.get(`${API_BASE}/workers/`, authHeader()),
        axios.get(`${API_BASE}/worksites/${id}/workers/`, authHeader()),
      ]);

      setWorksite(wsRes.data);
      setWorkers(workersRes.data);
      setAssignedWorkers(assignedRes.data);
    } catch (err) {
      console.error("Failed to load worksite data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // ➕ Assign worker
  const assignWorker = async () => {
    if (!selectedWorker) return;

    await axios.post(
      `${API_BASE}/worksites/${id}/assign_worker/`,
      { worker_id: selectedWorker },
      authHeader()
    );

    setSelectedWorker("");
    loadData();
  };

  // ➖ Remove worker
  const removeWorker = async (assignmentId) => {
    await axios.post(
      `${API_BASE}/worksites/${id}/remove_worker/`,
      { assignment_id: assignmentId },
      authHeader()
    );
    loadData();
  };

  // 🔁 Change status
  const changeStatus = async (status) => {
    await axios.patch(
      `${API_BASE}/worksites/${id}/change_status/`,
      { status },
      authHeader()
    );
    loadData();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        {/* 🔹 Header */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {worksite.work_name}
              </h1>
              <p className="text-slate-600">
                Client: <b>{worksite.client_name}</b>
              </p>
              <p className="text-slate-600">
                Location: {worksite.location || "-"}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                statusColors[worksite.status]
              }`}
            >
              {worksite.status}
            </span>
          </div>

          {/* 🔁 Status Change */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["PENDING", "ACTIVE", "INACTIVE", "COMPLETED"].map((st) => (
              <button
                key={st}
                onClick={() => changeStatus(st)}
                disabled={worksite.status === "COMPLETED"}
                className="px-3 py-1 border rounded text-sm hover:bg-slate-100 disabled:opacity-50"
              >
                {st}
              </button>
              
            ))}

          {/* <button
            onClick={() => navigate(`/attendance/mark?worksite=${id}`)}
            className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800"
          >
            Mark Attendance
          </button> */}

          </div>

        </div>

        {/* 👷 Assign Worker */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Assign Worker</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="border px-4 py-2 rounded w-full sm:w-64"
              disabled={worksite.status === "COMPLETED"}
            >
              <option value="">Select Worker</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.village || "—"})
                </option>
              ))}
            </select>

            <button
              onClick={assignWorker}
              disabled={!selectedWorker || worksite.status === "COMPLETED"}
              className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 disabled:opacity-50"
            >
              Assign
            </button>
          </div>
        </div>

        {/* 📋 Assigned Workers */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Worker</th>
                <th className="p-3 text-left">Assigned Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedWorkers.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.worker_name}</td>
                  <td className="p-3">{a.assigned_date}</td>
                  <td className="p-3">
                    <button
                      onClick={() => removeWorker(a.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {assignedWorkers.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 text-center text-slate-500"
                  >
                    No workers assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WorksiteDetails;
