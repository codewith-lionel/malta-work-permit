import React from "react";
import { Link } from "react-router-dom";

export default function PermitCard({ permit }) {
  if (!permit) return null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {permit.fullName}
          </h3>
          <p className="text-sm text-gray-500">
            Passport: {permit.passportNumber || "-"}
          </p>
          <p className="text-sm text-gray-500">
            Nationality: {permit.nationality || "-"}
          </p>
          <p className="text-sm text-gray-500">
            DOB: {formatDate(permit.dateOfBirth)}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 text-sm rounded font-medium ${
              permit.status === "Approved"
                ? "bg-green-100 text-green-700"
                : permit.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {permit.status}
          </span>
          <div className="mt-2 text-xs text-gray-400">
            ID: {permit.workPermitId}
          </div>
        </div>
      </div>

      {/* Grid section for job details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <div className="text-xs text-gray-400">Employer</div>
          <div>{permit.employer || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Job Title</div>
          <div>{permit.jobTitle || "-"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Start Date</div>
          <div>{formatDate(permit.permitStartDate)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Expiry Date</div>
          <div>{formatDate(permit.permitExpiryDate)}</div>
        </div>
      </div>

      {/* Footer section */}
      <div className="mt-5 flex justify-end">
        <Link
          to={`/permit/${encodeURIComponent(permit.workPermitId)}`}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
        >
          View Full Permit
        </Link>
      </div>
    </div>
  );
}
