import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPermit } from "../api/permits";

/**
 * PermitView
 * - Fetches permit by workPermitId from backend (GET /api/permits/:id)
 * - Renders a printable, government-style permit page (no map)
 * - Buttons: Print (window.print) and Return to Dashboard (navigate('/'))
 *
 * Usage: <Route path="/permit/:id" element={<PermitView />} />
 */
export default function PermitView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPermit(id);
        setPermit(res.data.permit || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Permit not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function fmtDate(d) {
    if (!d) return "-";
    try {
      const date = new Date(d);
      if (isNaN(date)) return "-";
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  }

  const data = permit || {
    // fallback example when no permit loaded (displayed exactly as your text)
    workPermitId: id || "WP-MTA-2025-768482",
    fullName: "LIONEL L",
    passportNumber: "123456",
    dateOfBirth: null,
    nationality: null,
    employer: null,
    jobTitle: null,
    permitStartDate: null,
    permitExpiryDate: null,
    status: permit?.status || "Pending",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm text-gray-500">Government of Malta</div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              WORK PERMIT
            </h1>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Work Permit ID</div>
            <div className="mt-1 font-medium text-lg">{data.workPermitId}</div>
            <div
              className={`mt-2 inline-block px-3 py-1 text-sm rounded ${
                data.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : data.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.status}
            </div>
          </div>
        </div>

        <section className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-400">Full Name</div>
              <div className="font-medium">{data.fullName || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Passport No.</div>
              <div className="font-medium">{data.passportNumber || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Date of Birth</div>
              <div>{fmtDate(data.dateOfBirth)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Nationality</div>
              <div>{data.nationality || "-"}</div>
            </div>
          </div>
        </section>

        <section className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-400">Employer</div>
              <div>{data.employer || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Job Title</div>
              <div>{data.jobTitle || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Permit Start Date</div>
              <div>{fmtDate(data.permitStartDate)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Permit Expiry Date</div>
              <div>{fmtDate(data.permitExpiryDate)}</div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 p-3 rounded bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-6 text-sm text-gray-500">Loading permit...</div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Print
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 rounded-md bg-white border"
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* small helper for print styles: hide everything except the permit card */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:p-0, .print\\:shadow-none { visibility: visible; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:only { visibility: visible; }
        }
      `}</style>
    </div>
  );
}
