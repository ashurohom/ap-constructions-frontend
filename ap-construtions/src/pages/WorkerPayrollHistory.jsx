import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getWorkerPayrollHistory } from "../services/payrollService";

const WorkerPayrollHistory = () => {
  const { workerId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getWorkerPayrollHistory(workerId).then(setData);
  }, [workerId]);

  if (!data) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Worker Salary History</h1>

        {/* Unpaid Summary */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <p>
            <strong>Unpaid Days:</strong>{" "}
            {data.unpaid_summary.unpaid_days}
          </p>
          <p>
            <strong>Total Unpaid Amount:</strong> ₹
            {data.unpaid_summary.total_unpaid_amount}
          </p>
        </div>

        {/* Daily Attendance */}
        <div className="bg-white rounded-xl shadow mb-6 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Worksite</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
                {/* <th className="p-3">Payment</th> */}
              </tr>
            </thead>
            <tbody>
              {data.daily_attendance.map((a, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3">{a.worksite_name}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">₹{a.amount_earned}</td>
                  {/* <td className="p-3">{a.payment_status}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Payroll */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Full Days</th>
                <th className="p-3">Half Days</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly_payroll.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.month}</td>
                  <td className="p-3">{m.total_full_days}</td>
                  <td className="p-3">{m.total_half_days}</td>
                  <td className="p-3">₹{m.total_amount}</td>
                  <td className="p-3">{m.paid_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WorkerPayrollHistory;
