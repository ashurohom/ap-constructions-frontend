import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ExpenseModal from "../components/ExpenseModal";
import { getExpenses } from "../services/expenseService";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [worksites, setWorksites] = useState([]);

  const loadData = async () => {
    const data = await getExpenses(filters);
    setExpenses(data.results);
    setTotal(data.total_amount);
  };

  useEffect(() => {
    loadData();
    axios.get(`${API}/clients/`, authHeader()).then(r => setClients(r.data));
    axios.get(`${API}/worksites/`, authHeader()).then(r => setWorksites(r.data));
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6 bg-slate-100 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <button onClick={() => setShowAdd(true)} className="bg-slate-900 text-white px-4 py-2 rounded">
            + Add Expense
          </button>
        </div>

        {/* Total */}
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <p className="text-sm text-slate-500">Total Expense</p>
          <p className="text-2xl font-bold text-red-600">₹ {total}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Title</th>
                <th className="p-3">Client</th>
                <th className="p-3">Worksite</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.expense_date}</td>
                  <td className="p-3">{e.title}</td>
                  <td className="p-3">{e.client_name || "-"}</td>
                  <td className="p-3">{e.worksite_name || "-"}</td>
                  <td className="p-3 text-red-600">₹ {e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={loadData}
        clients={clients}
        worksites={worksites}
      />
    </>
  );
};

export default Expenses;
