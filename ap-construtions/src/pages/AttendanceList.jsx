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
  const [date, setDate] = useState("");

  const loadAttendance = async () => {
    const res = await axios.get(`${API_BASE}/attendance/`, {
      ...authHeader(),
      params: { date },
    });
    setAttendance(res.data);
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markPaid = async (id) => {
    await axios.patch(
      `${API_BASE}/attendance/${id}/mark_paid/`,
      {},
      authHeader()
    );
    loadAttendance();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>

        {/* Filter */}
        <div className="mb-4">
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={loadAttendance}
            className="ml-3 bg-slate-900 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Worker</th>
                <th className="p-3">Worksite</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Action</th>
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
                  <td className="p-3">{a.payment_status}</td>
                  <td className="p-3">
                    {a.payment_status === "UNPAID" && (
                      <button
                        onClick={() => markPaid(a.id)}
                        className="text-green-600 hover:underline"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {attendance.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-slate-500">
                    No attendance found
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

export default AttendanceList;
