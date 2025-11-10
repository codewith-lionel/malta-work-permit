import React from "react";

const HOST = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

function fmtDate(value) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  } catch {
    return "-";
  }
}

export default function PermitCard({ permit }) {
  if (!permit) return null;

  const {
    workPermitId,
    fullName,
    passportNumber,
    nationality,
    dateOfBirth,
    employer,
    jobTitle,
    permitStartDate,
    permitExpiryDate,
    status,
    image,
  } = permit;

  // image might be stored as '/uploads/filename.jpg' or a full URL
  const imageSrc =
    image && (image.startsWith("http") ? image : `${HOST}${image}`);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${fullName || "Applicant"} photo`}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400 border">
              No Image
            </div>
          )}

          <div>
            <div className="text-xs text-gray-500">Work Permit ID</div>
            <div className="font-semibold text-lg">{workPermitId || "-"}</div>

            <div className="mt-2 text-sm text-gray-600">
              <div>
                <span className="text-xs text-gray-400">Full Name: </span>
                <span className="font-medium">{fullName || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400">Passport: </span>
                <span className="font-medium">{passportNumber || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`inline-block px-3 py-1 text-sm rounded ${
              status === "Approved"
                ? "bg-green-100 text-green-700"
                : status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status || "Pending"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        <div>
          <div className="text-xs text-gray-400">Nationality</div>
          <div className="font-medium">{nationality || "-"}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Date of Birth</div>
          <div>{fmtDate(dateOfBirth)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Employer</div>
          <div className="font-medium">{employer || "-"}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Job Title</div>
          <div className="font-medium">{jobTitle || "-"}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Permit Start</div>
          <div>{fmtDate(permitStartDate)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Permit Expiry</div>
          <div>{fmtDate(permitExpiryDate)}</div>
        </div>
      </div>
    </div>
  );
}
