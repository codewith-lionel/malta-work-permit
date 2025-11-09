import React, { useState } from "react";
import { deletePermit, checkStatus } from "../api/permits";

export default function DeletePermit() {
  const [query, setQuery] = useState("");
  const [permit, setPermit] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setMessage("");
    try {
      const res = await checkStatus(query);
      setPermit(res.data.permit);
    } catch {
      setPermit(null);
      setError("Permit not found");
    }
  };

  const handleDelete = async () => {
    if (!permit) return;
    if (!window.confirm("Are you sure you want to delete this permit?")) return;

    try {
      await deletePermit(permit.workPermitId);
      setMessage("Permit deleted successfully!");
      setPermit(null);
      setQuery("");
    } catch {
      setError("Failed to delete permit");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-[#0d3b66] mb-6">
        Delete Work Permit
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Work Permit ID or Passport Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
        />
        <button
          onClick={handleFetch}
          className="bg-[#d62828] text-white px-4 py-2 rounded-md hover:bg-[#ba2020]"
        >
          Fetch Permit
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {permit && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="font-semibold text-lg mb-2">Permit Details</h2>
          <p>
            <strong>ID:</strong> {permit.workPermitId}
          </p>
          <p>
            <strong>Full Name:</strong> {permit.fullName}
          </p>
          <p>
            <strong>Passport Number:</strong> {permit.passportNumber}
          </p>
          <p>
            <strong>Nationality:</strong> {permit.nationality || "-"}
          </p>
          <p>
            <strong>Employer:</strong> {permit.employer || "-"}
          </p>
          <p>
            <strong>Job Title:</strong> {permit.jobTitle || "-"}
          </p>
          <p>
            <strong>Permit Start:</strong>{" "}
            {permit.permitStartDate
              ? new Date(permit.permitStartDate).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Permit Expiry:</strong>{" "}
            {permit.permitExpiryDate
              ? new Date(permit.permitExpiryDate).toLocaleDateString()
              : "-"}
          </p>
          {permit.image && (
            <img
              src={permit.image}
              alt="Permit"
              className="mt-2 w-32 h-32 object-cover border rounded"
            />
          )}

          <button
            onClick={handleDelete}
            className="mt-4 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-all"
          >
            Delete Permit
          </button>
        </div>
      )}
    </div>
  );
}
