import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const loadAttendance = async (pageNumber = 1) => {
    const res = await axios.get(`${API_BASE}/attendance/`, {
      ...authHeader(),
      params: {
        date,
        search,
        page: pageNumber,
      },
    });

    setAttendance(res.data.results);
    setCount(res.data.count);
    setPage(pageNumber);
  };

  useEffect(() => {
    loadAttendance(1);
  }, []);

  const totalPages = Math.ceil(count / 15);

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by worker or worksite"
            className="border px-4 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => loadAttendance(1)}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Worker</th>
                <th className="p-3">Worksite</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3">{a.worker_name}</td>
                  <td className="p-3">{a.worksite_name}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">₹{a.amount_earned}</td>
                </tr>
              ))}

              {attendance.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-slate-500">
                    No attendance found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => loadAttendance(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => loadAttendance(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? "bg-slate-900 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => loadAttendance(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceList;
