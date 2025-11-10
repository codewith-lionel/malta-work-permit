import React, { useEffect, useState } from "react";
import { listPermits } from "../api/permits";
import PermitCard from "../components/PermitCard";
import { useNavigate } from "react-router-dom";

export default function PermitsList() {
  const [permits, setPermits] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPermits = async ({
    q: query = q,
    page: p = page,
    limit: l = limit,
  } = {}) => {
    try {
      setLoading(true);
      setError("");
      const res = await listPermits({ q: query, page: p, limit: l });
      // server returns { data: permits, page, limit, total }
      const payload = res.data || {};
      setPermits(payload.data || []);
      setPage(payload.page || 1);
      setLimit(payload.limit || l);
      setTotal(payload.total || 0);
    } catch (err) {
      console.error("Failed to fetch permits", err);
      setError(err?.response?.data?.message || "Failed to load permits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await fetchPermits({ q, page: 1, limit });
  };

  const goToPage = async (p) => {
    if (p < 1) return;
    const last = Math.max(1, Math.ceil(total / limit || 1));
    if (p > last) return;
    setPage(p);
    await fetchPermits({ q, page: p, limit });
  };

  const handleLimitChange = async (e) => {
    const l = parseInt(e.target.value, 10) || 12;
    setLimit(l);
    setPage(1);
    await fetchPermits({ q, page: 1, limit: l });
  };

  const renderPagination = () => {
    const last = Math.max(1, Math.ceil(total / limit || 1));
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(last, page + 2);
    for (let p = start; p <= end; p++) pages.push(p);

    return (
      <div className="flex items-center gap-2 mt-6">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Prev
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-50"
            >
              1
            </button>
            {start > 2 && <span className="px-2">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 rounded border ${
              p === page
                ? "bg-[#0d3b66] text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        {end < last && (
          <>
            {end < last - 1 && <span className="px-2">…</span>}
            <button
              onClick={() => goToPage(last)}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-50"
            >
              {last}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === last}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>

        <div className="ml-4 text-sm text-gray-600">
          Showing <span className="font-medium">{permits.length}</span> of{" "}
          <span className="font-medium">{total}</span>
        </div>

        <select
          value={limit}
          onChange={handleLimitChange}
          className="ml-auto border rounded p-1"
        >
          <option value={6}>6 / page</option>
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#0d3b66]">
          All Created Permits
        </h1>
        <div className="flex items-center gap-3">
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              placeholder="Search by name, passport, employer or workPermitId"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border rounded p-2 w-80"
            />
            <button
              type="submit"
              className="bg-[#d62828] text-white px-3 py-2 rounded"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-20">Loading permits…</div>
      ) : (
        <>
          {permits.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              No permits found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {permits.map((p) => (
                <div
                  key={p.workPermitId || p._id}
                  onClick={() =>
                    navigate(`/permit/${encodeURIComponent(p.workPermitId)}`)
                  }
                  className="cursor-pointer"
                >
                  <PermitCard permit={p} />
                </div>
              ))}
            </div>
          )}

          {renderPagination()}
        </>
      )}
    </div>
  );
}
