import React, { useState } from "react";
import { checkStatus } from "../api/permits";
import PermitCard from "../components/PermitCard";

export default function CheckPermit() {
  const [query, setQuery] = useState("");
  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onCheck(e) {
    e?.preventDefault();
    if (!query) return alert("Enter a Work Permit ID or passport number");
    setLoading(true);
    setPermit(null);
    try {
      const res = await checkStatus(query.trim());
      setPermit(res.data.permit);
    } catch (err) {
      alert(err?.response?.data?.message || "Permit not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Check Your Work Permit Application Status
      </h1>

      <form onSubmit={onCheck} className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow border rounded-md p-2"
          placeholder="WP-MTA-2024-1234 or passport number"
        />
        <button
          className="btn bg-govBlue text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {permit && (
        <div className="mt-6">
          <PermitCard permit={permit} />
        </div>
      )}
    </div>
  );
}
