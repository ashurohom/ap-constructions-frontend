import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ClientModal from "../components/ClientModal";
import ConfirmDelete from "../components/ConfirmDelete";
import { getClients, deleteClient } from "../services/clientService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>

          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800"
          >
            + Add Client
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by client name..."
          className="w-full sm:w-1/3 px-4 py-2 mb-4 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Client List */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-200 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Site Name</th>
                <th className="p-3">Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t">
                  <td className="p-3 font-medium">{client.name}</td>
                  <td className="p-3 text-slate-700">
                    {client.site_name || "-"}
                  </td>
                  <td className="p-3 text-slate-600">
                    {client.address || "-"}
                  </td>
                  <td className="p-3">{client.phone || "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setDeleteClientId(client.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-500">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ClientModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={loadClients}
      />

      <ConfirmDelete
        isOpen={!!deleteClientId}
        onClose={() => setDeleteClientId(null)}
        onConfirm={async () => {
          await deleteClient(deleteClientId);
          setDeleteClientId(null);
          loadClients();
        }}
      />
    </>
  );
};

export default Clients;
