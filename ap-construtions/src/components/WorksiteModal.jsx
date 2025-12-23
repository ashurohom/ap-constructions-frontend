import { useEffect, useState } from "react";
import { createWorksite } from "../services/worksiteService";

const WorksiteModal = ({ isOpen, onClose, onSuccess, clients }) => {
  const [client, setClient] = useState("");
  const [workName, setWorkName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClient("");
      setWorkName("");
      setLocation("");
      setStartDate("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await createWorksite({
        client,
        work_name: workName,
        location,
        start_date: startDate,
      });
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Worksite</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            required
            className="w-full border px-3 py-2 rounded"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            required
            placeholder="Worksite Name"
            className="w-full border px-3 py-2 rounded"
            value={workName}
            onChange={(e) => setWorkName(e.target.value)}
          />

          <input
            placeholder="Location"
            className="w-full border px-3 py-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            required
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorksiteModal;
