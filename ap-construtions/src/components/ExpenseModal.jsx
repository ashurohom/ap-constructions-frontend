import { useEffect, useState } from "react";
import { createExpense } from "../services/expenseService";

const ExpenseModal = ({ isOpen, onClose, onSuccess, clients, worksites }) => {
  const [form, setForm] = useState({
    expense_date: "",
    title: "",
    description: "",
    amount: "",
    client: "",
    worksite: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setForm({
        expense_date: today,
        title: "",
        description: "",
        amount: "",
        client: "",
        worksite: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    await createExpense({
      ...form,
      amount: Number(form.amount),
      client: form.client || null,
      worksite: form.worksite || null,
    });

    onSuccess();
    onClose();
    setLoading(false);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-4 md:py-0 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
        
        {/* Header - Sticky on mobile */}
        <div className="sticky top-0 bg-white px-4 py-3 md:px-6 md:py-4 border-b z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Expense
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Record a new expense entry
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-4 py-4 md:px-6 md:py-4 space-y-4">
          
          {/* Date + Amount - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Expense Date *
              </label>
              <input
                type="date"
                name="expense_date"
                required
                value={form.expense_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="amount"
                  required
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Expense Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Cement purchase, Transport, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Client + Worksite - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Client (Optional)
              </label>
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Worksite *
              </label>
              <select
                name="worksite"
                value={form.worksite}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
              >
                <option value="">Select Worksite</option>
                {worksites.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.work_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Additional details about the expense..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
        </form>

        {/* Footer - Sticky on mobile */}
        <div className="sticky bottom-0 bg-white px-4 py-3 md:px-6 md:py-4 border-t flex flex-col sm:flex-row justify-end gap-3">
          <div className="flex-1 sm:flex-none flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 text-sm md:text-base"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={submit}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;