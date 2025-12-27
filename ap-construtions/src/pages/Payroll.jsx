import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  generatePayroll,
  getPayrollList,
  markPayrollPaid,
  markPayrollUnpaid,
} from "../services/payrollService";
import { useNavigate } from "react-router-dom";

const Payroll = () => {
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [payroll, setPayroll] = useState([]);
  const navigate = useNavigate();

  const loadPayroll = async () => {
    const data = await getPayrollList({
      month,
      worker: search,
    });
    setPayroll(data);
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const handleGenerate = async () => {
    if (!month) {
      alert("Select month first");
      return;
    }
    await generatePayroll(month);
    loadPayroll();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Payroll</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">
          <input
            type="month"
            className="border px-4 py-2 rounded"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search worker..."
            className="border px-4 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Generate Payroll
          </button>

          {/* <button
            onClick={loadPayroll}
            className="border px-4 py-2 rounded"
          >
            Filter
          </button> */}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Worker</th>
                <th className="p-3">Full Days</th>
                <th className="p-3">Half Days</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p) => (
                <tr key={p.id} className="border-t">
                  <td
                    className="p-3 text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/payroll/worker/${p.worker}`)
                    }
                  >
                    {p.worker_name}
                  </td>
                  <td className="p-3">{p.total_full_days}</td>
                  <td className="p-3">{p.total_half_days}</td>
                  <td className="p-3">₹{p.total_amount}</td>
                  <td className="p-3">{p.paid_status}</td>
                  <td className="p-3">
                    {p.paid_status === "UNPAID" ? (
                      <button
                        onClick={() => markPayrollPaid(p.id).then(loadPayroll)}
                        className="text-green-600 hover:underline"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          markPayrollUnpaid(p.id).then(loadPayroll)
                        }
                        className="text-red-600 hover:underline"
                      >
                        Mark Unpaid
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {payroll.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-500">
                    No payroll data
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

export default Payroll;
