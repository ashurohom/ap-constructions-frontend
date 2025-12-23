import { useEffect, useState } from "react";
import { createWorker } from "../services/workerService";

const WorkerModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [fullRate, setFullRate] = useState("");
  const [halfRate, setHalfRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("");
      setVillage("");
      setFullRate("");
      setHalfRate("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 prevent double submit

    setLoading(true);
    setError("");

    try {
      await createWorker({
        name,
        phone,
        village,
        full_day_rate: Number(fullRate),
        half_day_rate: Number(halfRate),
      });

      onSuccess(); // refresh worker list
      onClose();   // close modal
    } catch (err) {
      console.error(err);
      setError("Failed to save worker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Worker</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Worker Name"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Village"
            className="w-full border px-3 py-2 rounded"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />

          <input
            required
            type="number"
            placeholder="Full Day Rate"
            className="w-full border px-3 py-2 rounded"
            value={fullRate}
            onChange={(e) => setFullRate(e.target.value)}
          />

          <input
            required
            type="number"
            placeholder="Half Day Rate"
            className="w-full border px-3 py-2 rounded"
            value={halfRate}
            onChange={(e) => setHalfRate(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {loading ? "Saving..." : "Save Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkerModal;
