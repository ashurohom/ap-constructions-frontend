import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import {
  getWorkerPayrollHistory,
  getWorkerPayrollLedger,
  addSalaryPayment,
} from "../services/payrollService";

const WorkerPayrollHistory = () => {
  const { workerId } = useParams();

  const [history, setHistory] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [paymentType, setPaymentType] = useState("ADVANCE");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* LOAD HISTORY */
  useEffect(() => {
    setLoading(true);
    getWorkerPayrollHistory(workerId)
      .then(data => {
        setHistory(data);
        setError("");
      })
      .catch(err => {
        console.error("Error loading history:", err);
        setError("Failed to load worker history");
        setHistory(null);
      })
      .finally(() => setLoading(false));
  }, [workerId]);

  /* LOAD LEDGER */
  useEffect(() => {
    if (month) {
      setLoading(true);
      getWorkerPayrollLedger(workerId, month)
        .then(data => {
          setLedger(data);
          setError("");
        })
        .catch(err => {
          console.error("Error loading ledger:", err);
          setError("Failed to load ledger data");
          setLedger(null);
        })
        .finally(() => setLoading(false));
    }
  }, [workerId, month]);

  const handlePayment = async () => {
    if (!amount || !paymentDate) {
      alert("Please enter amount and payment date");
      return;
    }

    const paymentMonth = paymentDate.slice(0, 7);

    try {
      await addSalaryPayment({
        worker: workerId,
        month: paymentMonth,
        payment_type: paymentType,
        amount: parseFloat(amount),
        payment_date: paymentDate,
        note: remarks.trim(),
      });

      setAmount("");
      setRemarks("");
      setPaymentDate("");
      
      // Refresh ledger
      const updatedLedger = await getWorkerPayrollLedger(workerId, paymentMonth);
      setLedger(updatedLedger);
      
      alert("Payment saved successfully!");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment. Please check the details.");
    }
  };

  if (loading && !history) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">
          <div className="text-slate-500">Loading worker salary history...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Worker Salary History
          </h1>
          <p className="text-slate-500 text-sm">
            Worker ID: {workerId}
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* PAYMENT ENTRY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Salary Payment Entry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="ADVANCE">Advance</option>
              <option value="FINAL">Final Salary</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />

            <input
              type="date"
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />

            <input
              type="text"
              placeholder="Remarks (optional)"
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              onClick={handlePayment}
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 transition-colors"
              disabled={!amount || !paymentDate}
            >
              Save Payment
            </button>
          </div>
        </div>

        {/* MONTH SELECT */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4 items-center">
          <label className="text-sm font-medium text-slate-700">
            Select Month (YYYY-MM)
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LEDGER SUMMARY */}
        {ledger && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard 
                label="Earned Salary" 
                value={ledger.earned_salary} 
                color="bg-indigo-600" 
              />
              <SummaryCard 
                label="Total Paid" 
                value={ledger.total_paid} 
                color="bg-emerald-600" 
              />
              <SummaryCard 
                label="Opening Balance" 
                value={ledger.opening_balance} 
                color="bg-sky-600" 
              />
              <SummaryCard
                label="Closing Balance"
                value={ledger.closing_balance}
                color={ledger.closing_balance < 0 ? "bg-red-600" : "bg-green-600"}
              />
            </div>

            {/* PAYMENT HISTORY TABLE */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Payment History for {month}</h3>
              {ledger.payments && ledger.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.payments.map((payment, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{payment.payment_date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.payment_type === 'ADVANCE' ? 'bg-yellow-100 text-yellow-800' :
                              payment.payment_type === 'FINAL' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {payment.payment_type}
                            </span>
                          </td>
                          <td className="p-3 font-medium">₹{payment.amount}</td>
                          <td className="p-3 text-slate-600">{payment.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No payments recorded for this month</p>
              )}
            </div>
          </>
        )}

        {/* MONTHLY HISTORY TABLE */}
        {history && history.monthly_payroll && history.monthly_payroll.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Monthly Payroll Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Full Days</th>
                    <th className="p-3 text-left">Half Days</th>
                    <th className="p-3 text-left">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.monthly_payroll.map((payroll, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 font-medium">{payroll.month}</td>
                      <td className="p-3">{payroll.total_full_days}</td>
                      <td className="p-3">{payroll.total_half_days}</td>
                      <td className="p-3 font-medium">₹{payroll.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`p-4 rounded-xl text-white shadow ${color}`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-2xl font-bold">₹{typeof value === 'number' ? value.toFixed(2) : value}</p>
  </div>
);

export default WorkerPayrollHistory;