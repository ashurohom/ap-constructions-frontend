import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import {
  getWorkerPayrollHistory,
  getWorkerPayrollLedger,
  addSalaryPayment,
} from "../services/payrollService";
import { getWorkerById } from "../services/workerService";

const WorkerPayrollHistory = () => {
  const { workerId } = useParams();

  const [worker, setWorker] = useState(null);
  const [history, setHistory] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [paymentType, setPaymentType] = useState("ADVANCE");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* LOAD WORKER DETAILS */
  useEffect(() => {
    const loadWorkerDetails = async () => {
      try {
        const workerData = await getWorkerById(workerId);
        setWorker(workerData);
      } catch (err) {
        console.error("Error loading worker:", err);
      }
    };
    loadWorkerDetails();
  }, [workerId]);

  /* LOAD HISTORY AND INITIAL LEDGER */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [historyData, ledgerData] = await Promise.all([
          getWorkerPayrollHistory(workerId),
          getWorkerPayrollLedger(workerId, month)
        ]);
        setHistory(historyData);
        setLedger(ledgerData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load payroll data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      loadData();
    }
  }, [workerId, month]);

  const handlePayment = async () => {
    if (!amount || !paymentDate) {
      setError("Please enter amount and payment date");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const paymentMonth = paymentDate.slice(0, 7);
    setSuccess("");
    setError("");

    try {
      const payload = {
        worker: parseInt(workerId),
        month: paymentMonth,
        payment_type: paymentType,
        amount: parseFloat(amount),
        payment_date: paymentDate,
        note: remarks.trim(),
      };

      await addSalaryPayment(payload);

      // Reset form
      setAmount("");
      setRemarks("");
      setPaymentDate("");
      
      // Refresh ledger
      const updatedLedger = await getWorkerPayrollLedger(workerId, paymentMonth);
      setLedger(updatedLedger);
      
      // Show success message
      setSuccess(`Payment of ₹${parseFloat(amount).toFixed(2)} saved successfully!`);
      setTimeout(() => setSuccess(""), 5000);
      
    } catch (err) {
      console.error("Error saving payment:", err);
      setError(err.message || "Failed to save payment. Please check the details.");
    }
  };

  // Calculate attendance summary for current month
  const calculateAttendanceSummary = () => {
    if (!history?.daily_attendance) return { fullDays: 0, halfDays: 0, totalEarned: 0 };
    
    const currentMonthAttendance = history.daily_attendance.filter(att => {
      const attMonth = att.attendance_date.slice(0, 7);
      return attMonth === month;
    });
    
    const fullDays = currentMonthAttendance.filter(a => a.status === 'FULL').length;
    const halfDays = currentMonthAttendance.filter(a => a.status === 'HALF').length;
    const totalEarned = currentMonthAttendance.reduce((sum, att) => sum + parseFloat(att.amount_earned), 0);
    
    return { fullDays, halfDays, totalEarned };
  };

  const attendanceSummary = calculateAttendanceSummary();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading payroll data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Worker Salary Details
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-800 font-medium">
                    {worker?.name || `Worker #${workerId}`}
                  </p>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  ID: {workerId}
                </span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}
        </div>

        {/* ATTENDANCE SUMMARY */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance Summary - {month}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Full Days</p>
              <p className="text-2xl font-bold text-blue-600">
                {ledger?.full_days || attendanceSummary.fullDays || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Half Days</p>
              <p className="text-2xl font-bold text-yellow-600">
                {ledger?.half_days || attendanceSummary.halfDays || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-green-600">
                {(ledger?.full_days || attendanceSummary.fullDays || 0) + 
                 ((ledger?.half_days || attendanceSummary.halfDays || 0) * 0.5)}
              </p>
            </div>
          </div>
          {!ledger?.payroll_generated && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
              <p className="text-sm text-yellow-700">
                ⚡ Real-time calculation from attendance records
              </p>
            </div>
          )}
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Earned Salary</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{(ledger?.earned_salary || attendanceSummary.totalEarned || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              From {ledger?.full_days || attendanceSummary.fullDays || 0} full + {ledger?.half_days || attendanceSummary.halfDays || 0} half days
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">₹{ledger?.total_paid?.toFixed(2) || "0.00"}</p>
          </div>
          
          <div className={`p-4 rounded-lg shadow-sm border ${(ledger?.closing_balance || 0) < 0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Balance</p>
                <p className={`text-2xl font-bold ${(ledger?.closing_balance || 0) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  ₹{ledger?.closing_balance?.toFixed(2) || "0.00"}
                </p>
              </div>
              {(ledger?.closing_balance || 0) < 0 && (
                <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  Advance
                </span>
              )}
            </div>
            {(ledger?.closing_balance || 0) < 0 ? (
              <p className="text-xs text-red-600 mt-2">
                Worker has been paid in advance
              </p>
            ) : (ledger?.closing_balance || 0) > 0 ? (
              <p className="text-xs text-green-600 mt-2">
                Amount pending to pay
              </p>
            ) : null}
          </div>
        </div>

        {/* MAIN CONTENT - SIMPLE LAYOUT */}
        <div className="space-y-6">
          {/* ADD PAYMENT SECTION */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ADVANCE">Advance</option>
                  <option value="FINAL">Final Salary</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g., Advance for medical"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!amount || !paymentDate}
              className={`w-full mt-6 py-2.5 px-4 rounded font-medium ${!amount || !paymentDate ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Save Payment
            </button>
          </div>

          {/* TWO COLUMNS FOR HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PAYMENT HISTORY */}
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History - {month}</h2>
              {ledger?.payments && ledger.payments.length > 0 ? (
                <div className="space-y-3">
                  {ledger.payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs rounded ${payment.payment_type === 'ADVANCE' ? 'bg-yellow-100 text-yellow-800' : payment.payment_type === 'FINAL' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {payment.payment_type}
                          </span>
                          <span className="text-sm text-gray-500">{payment.payment_date}</span>
                        </div>
                        {payment.note && (
                          <p className="text-sm text-gray-600">{payment.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No payments recorded for this month</p>
                </div>
              )}
            </div>

            {/* MONTHLY SUMMARY */}
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h2>
              {history?.monthly_payroll && history.monthly_payroll.length > 0 ? (
                <div className="space-y-3">
                  {history.monthly_payroll.slice(0, 5).map((payroll, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{payroll.month}</p>
                        <p className="text-sm text-gray-500">
                          {payroll.total_full_days} full, {payroll.total_half_days} half days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{parseFloat(payroll.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {history.monthly_payroll.length > 5 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      ...and {history.monthly_payroll.length - 5} more months
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No monthly payroll data available</p>
                </div>
              )}
            </div>
          </div>

          {/* RECENT ATTENDANCE */}
          {history?.daily_attendance && history.daily_attendance.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="p-2 text-left text-sm font-medium text-gray-700">Worksite</th>
                      <th className="p-2 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="p-2 text-left text-sm font-medium text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.daily_attendance
                      .filter(att => att.attendance_date.slice(0, 7) === month)
                      .slice(0, 10)
                      .map((attendance, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 text-sm">{attendance.attendance_date}</td>
                        <td className="p-2 text-sm text-gray-600">{attendance.worksite_name || '-'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 text-xs rounded ${attendance.status === 'FULL' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {attendance.status}
                          </span>
                        </td>
                        <td className="p-2 text-sm font-medium">₹{parseFloat(attendance.amount_earned).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkerPayrollHistory;