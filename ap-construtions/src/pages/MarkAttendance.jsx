import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const MarkAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [worksites, setWorksites] = useState([]);
  const [selectedWorksite, setSelectedWorksite] = useState("");
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  // Load worksites
  useEffect(() => {
    axios
      .get(`${API_BASE}/worksites/`, authHeader())
      .then((res) => setWorksites(res.data));
  }, []);

  // Load assigned workers
  const loadWorkers = async (worksiteId) => {
    if (!worksiteId) return;
    const res = await axios.get(
      `${API_BASE}/worksites/${worksiteId}/workers/`,
      authHeader()
    );
    setWorkers(res.data);
    setAttendance({});
  };

  const handleStatusChange = (workerId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [workerId]: status,
    }));
  };

  const saveAttendance = async () => {
    if (!date || !selectedWorksite) {
      alert("Please select date and worksite");
      return;
    }

    setLoading(true);

    try {
      for (let worker of workers) {
        await axios.post(
          `${API_BASE}/attendance/`,
          {
            attendance_date: date,
            worker: worker.worker,
            worksite: selectedWorksite,
            status: attendance[worker.worker] || "ABSENT",
          },
          authHeader()
        );
      }

      alert("Attendance saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded"
            value={selectedWorksite}
            onChange={(e) => {
              setSelectedWorksite(e.target.value);
              loadWorkers(e.target.value);
            }}
          >
            <option value="">Select Worksite</option>
            {worksites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.work_name}
              </option>
            ))}
          </select>
        </div>

        {/* Worker List */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Worker</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.worker} className="border-t">
                  <td className="p-3">{w.worker_name}</td>
                  <td className="p-3">
                    <select
                      className="border px-3 py-1 rounded"
                      value={attendance[w.worker] || "ABSENT"}
                      onChange={(e) =>
                        handleStatusChange(w.worker, e.target.value)
                      }
                    >
                      <option value="FULL">FULL</option>
                      <option value="HALF">HALF</option>
                      <option value="ABSENT">ABSENT</option>
                    </select>
                  </td>
                </tr>
              ))}

              {workers.length === 0 && (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-slate-500">
                    No workers assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save */}
        <div className="mt-6">
          <button
            onClick={saveAttendance}
            disabled={loading || workers.length === 0}
            className="bg-slate-900 text-white px-6 py-3 rounded hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MarkAttendance;
