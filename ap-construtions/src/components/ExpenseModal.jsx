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
      setForm({
        expense_date: "",
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">
            Add Expense
          </h2>
          <p className="text-sm text-slate-500">
            Record a new expense entry
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-6 py-4 space-y-4">

          {/* Date + Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Expense Date
              </label>
              <input
                type="date"
                name="expense_date"
                required
                value={form.expense_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                required
                value={form.amount}
                onChange={handleChange}
                placeholder="₹ Amount"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Expense Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Cement purchase, Transport, etc."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          {/* Client + Worksite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Client (Optional)
              </label>
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
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
              <label className="block text-sm font-medium mb-1">
                Worksite
              </label>
              <select
                name="worksite"
                value={form.worksite}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Additional details..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
