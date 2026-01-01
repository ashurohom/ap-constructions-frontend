import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import {
  getWorkerPayrollHistory,
  getWorkerPayrollLedger,
  addSalaryPayment,
} from "../services/payrollService";
import { getWorkerById } from "../services/workerService"; // You'll need to create this

const WorkerPayrollHistory = () => {
  const { workerId } = useParams();

  const [worker, setWorker] = useState(null);
  const [history, setHistory] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Current month
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentType, setPaymentType] = useState("ADVANCE");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [remarks, setRemarks] = useState("");

  /* LOAD WORKER DETAILS */
  useEffect(() => {
    const loadWorkerDetails = async () => {
      try {
        // You need to implement getWorkerById in workerService
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
    setLoading(true);
    Promise.all([
      getWorkerPayrollHistory(workerId),
      getWorkerPayrollLedger(workerId, month)
    ])
      .then(([historyData, ledgerData]) => {
        setHistory(historyData);
        setLedger(ledgerData);
        setError("");
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setError("Failed to load payroll data");
      })
      .finally(() => setLoading(false));
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

      // Reset form
      setAmount("");
      setRemarks("");
      setPaymentDate("");
      setPaymentType("ADVANCE");
      
      // Refresh ledger
      const updatedLedger = await getWorkerPayrollLedger(workerId, paymentMonth);
      setLedger(updatedLedger);
      
      // Show success notification
      alert("Payment saved successfully!");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment. Please check the details.");
    }
  };

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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Salary Management
              </h1>
              {worker ? (
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-700 font-medium">
                      {worker.name || `Worker #${workerId}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    ID: {workerId}
                  </span>
                </div>
              ) : (
                <p className="text-gray-600 mt-2">Worker ID: {workerId}</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - PAYMENT FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* PAYMENT ENTRY CARD */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Payment</h2>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "ADVANCE", label: "Advance", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
                      { value: "FINAL", label: "Final", color: "bg-green-100 text-green-800 border-green-200" },
                      { value: "ADJUSTMENT", label: "Adjust", color: "bg-blue-100 text-blue-800 border-blue-200" }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setPaymentType(type.value)}
                        className={`p-3 text-center rounded-lg border transition-all ${paymentType === type.value ? `${type.color} ring-2 ring-offset-1` : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                      >
                        <div className="font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!amount || !paymentDate}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all ${!amount || !paymentDate ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Save Payment Record
                </div>
              </button>
            </div>

            {/* PAYMENT HISTORY */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment History</h2>
              {ledger?.payments && ledger.payments.length > 0 ? (
                <div className="space-y-3">
                  {ledger.payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payment.payment_type === 'ADVANCE' ? 'bg-yellow-100' : payment.payment_type === 'FINAL' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {payment.payment_type === 'ADVANCE' ? 'A' : payment.payment_type === 'FINAL' ? 'F' : 'M'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.payment_type}</p>
                          <p className="text-sm text-gray-500">{payment.payment_date}</p>
                          {payment.note && (
                            <p className="text-sm text-gray-600 mt-1">{payment.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
                        <p className={`text-sm ${payment.payment_type === 'ADVANCE' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {payment.payment_type === 'ADVANCE' ? 'Advance Given' : 'Salary Paid'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
                  <p className="text-gray-500">Add your first payment using the form above</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - STATS AND SUMMARY */}
          <div className="space-y-6">
            {/* FINANCIAL SUMMARY */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Summary</h2>
              <div className="space-y-4">
                <SummaryCard 
                  label="Earned Salary" 
                  value={ledger?.earned_salary || 0} 
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="bg-blue-50 text-blue-700 border-blue-200"
                />
                <SummaryCard 
                  label="Total Paid" 
                  value={ledger?.total_paid || 0} 
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="bg-green-50 text-green-700 border-green-200"
                />
                <SummaryCard 
                  label="Closing Balance" 
                  value={ledger?.closing_balance || 0} 
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  color={`${(ledger?.closing_balance || 0) < 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}
                  showAlert={(ledger?.closing_balance || 0) < 0}
                  alertText="Overpaid"
                />
              </div>
            </div>

            {/* MONTHLY SUMMARY */}
            {history?.monthly_payroll && history.monthly_payroll.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Summary</h2>
                <div className="space-y-4">
                  {history.monthly_payroll.slice(0, 3).map((payroll, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payroll.month}</p>
                        <p className="text-sm text-gray-500">
                          {payroll.total_full_days} full, {payroll.total_half_days} half days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{payroll.total_amount}</p>
                      </div>
                    </div>
                  ))}
                  {history.monthly_payroll.length > 3 && (
                    <button className="w-full text-center py-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All {history.monthly_payroll.length} Months →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">Generate Payslip</span>
                  </div>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-green-700">Export</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Updated SummaryCard component
const SummaryCard = ({ label, value, icon, color, showAlert = false, alertText = "" }) => (
  <div className={`p-4 rounded-lg border ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {showAlert && (
        <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
          {alertText}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold">₹{typeof value === 'number' ? value.toFixed(2) : value}</p>
    {label === "Closing Balance" && value < 0 && (
      <p className="text-xs text-red-600 mt-2">
        Worker has been paid in advance
      </p>
    )}
  </div>
);

export default WorkerPayrollHistory;