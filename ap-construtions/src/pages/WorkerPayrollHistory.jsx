import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWorkerPayrollHistory,
  getWorkerPayrollLedger,
  addSalaryPayment,
} from "../services/payrollService";
import { getWorkerById } from "../services/workerService";

const WorkerPayrollHistory = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [history, setHistory] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
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

  const formatMonthYear = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
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
      
      <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6">
        {/* HEADER - Responsive Stack */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => navigate(-1)}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Salary Details
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-3 ml-0 md:ml-2">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm border border-gray-200">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <p className="text-sm md:text-base font-medium text-gray-800 truncate max-w-[150px] md:max-w-none">
                    {worker?.name || `Worker #${workerId}`}
                  </p>
                </div>
                <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 md:px-3 md:py-1 rounded-full">
                  ID: {workerId}
                </span>
              </div>
            </div>
            
            {/* Month Selector - Responsive */}
            <div className="w-full md:w-auto bg-white p-3 md:p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs md:text-sm font-medium text-gray-700">
                  Select Month
                </label>
                <span className="text-xs text-blue-600 md:hidden">
                  {formatMonthYear(month)}
                </span>
              </div>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 md:py-1.5 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="hidden md:block text-xs text-gray-500 mt-1">
                {formatMonthYear(month)}
              </p>
            </div>
          </div>

          {/* Notifications - Responsive */}
          {error && (
            <div className="mb-3 md:mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start md:items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 mt-0.5 md:mt-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-xs md:text-sm text-red-700 flex-1">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-3 md:mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-start md:items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5 md:mt-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs md:text-sm text-green-700 flex-1">{success}</span>
            </div>
          )}
        </div>

        {/* ATTENDANCE SUMMARY - Responsive Grid */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
            Attendance - {formatMonthYear(month)}
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Full Days</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {ledger?.full_days || attendanceSummary.fullDays || 0}
              </p>
            </div>
            <div className="text-center p-2 md:p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Half Days</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {ledger?.half_days || attendanceSummary.halfDays || 0}
              </p>
            </div>
            <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Total Days</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {(ledger?.full_days || attendanceSummary.fullDays || 0) + 
                 ((ledger?.half_days || attendanceSummary.halfDays || 0) * 0.5)}
              </p>
            </div>
          </div>
          {!ledger?.payroll_generated && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
              <p className="text-xs md:text-sm text-yellow-700">
                ⚡ Real-time calculation
              </p>
            </div>
          )}
        </div>

        {/* FINANCIAL SUMMARY - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Earned Salary</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 mb-1">
              ₹{(ledger?.earned_salary || attendanceSummary.totalEarned || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {ledger?.full_days || attendanceSummary.fullDays || 0} full + {ledger?.half_days || attendanceSummary.halfDays || 0} half days
            </p>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">₹{ledger?.total_paid?.toFixed(2) || "0.00"}</p>
          </div>
          
          <div className={`p-3 md:p-4 rounded-lg shadow-sm border ${(ledger?.closing_balance || 0) < 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Balance</p>
                <p className={`text-xl md:text-2xl font-bold ${(ledger?.closing_balance || 0) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
              <p className="text-xs text-red-600 mt-1 md:mt-2">
                Paid in advance
              </p>
            ) : (ledger?.closing_balance || 0) > 0 ? (
              <p className="text-xs text-green-600 mt-1 md:mt-2">
                Pending payment
              </p>
            ) : null}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-4 md:space-y-6">
          {/* ADD PAYMENT SECTION - Responsive Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Add Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Payment Type
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ADVANCE">Advance</option>
                  <option value="FINAL">Final Salary</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2.5 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g., Advance for medical"
                  className="w-full px-3 py-2.5 text-sm md:text-base border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!amount || !paymentDate || isSaving}
              className={`w-full mt-4 md:mt-6 py-2.5 md:py-3 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
                !amount || !paymentDate || isSaving 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Payment'
              )}
            </button>
          </div>

          {/* TWO COLUMNS FOR HISTORY - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* PAYMENT HISTORY */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Payment History</h2>
              {ledger?.payments && ledger.payments.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {ledger.payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-3 border rounded hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${payment.payment_type === 'ADVANCE' ? 'bg-yellow-100 text-yellow-800' : payment.payment_type === 'FINAL' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {payment.payment_type}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 truncate">{payment.payment_date}</span>
                        </div>
                        {payment.note && (
                          <p className="text-xs text-gray-600 truncate">{payment.note}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-sm md:text-base font-bold text-gray-900">₹{parseFloat(payment.amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-300 mb-2 md:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">No payments recorded</p>
                </div>
              )}
            </div>

            {/* MONTHLY SUMMARY */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Monthly Summary</h2>
              {history?.monthly_payroll && history.monthly_payroll.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {history.monthly_payroll.slice(0, 5).map((payroll, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-3 border rounded hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-gray-900 truncate">{payroll.month}</p>
                        <p className="text-xs text-gray-500">
                          {payroll.total_full_days} full, {payroll.total_half_days} half days
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-sm md:text-base font-bold text-gray-900">₹{parseFloat(payroll.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {history.monthly_payroll.length > 5 && (
                    <p className="text-center text-xs md:text-sm text-gray-500 mt-2">
                      ...and {history.monthly_payroll.length - 5} more months
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-300 mb-2 md:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No monthly data available</p>
                </div>
              )}
            </div>
          </div>

          {/* RECENT ATTENDANCE - Responsive Table */}
          {history?.daily_attendance && history.daily_attendance.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Attendance</h2>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Worksite</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.daily_attendance
                          .filter(att => att.attendance_date.slice(0, 7) === month)
                          .slice(0, 5)
                          .map((attendance, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {attendance.attendance_date}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                              <span className="truncate max-w-[100px] md:max-w-none inline-block">
                                {attendance.worksite_name || '-'}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${attendance.status === 'FULL' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {attendance.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{parseFloat(attendance.amount_earned).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkerPayrollHistory;