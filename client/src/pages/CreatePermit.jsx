import React, { useState } from "react";
import { createPermit } from "../api/permits";
import PermitCard from "../components/PermitCard";
import { useNavigate } from "react-router-dom";

export default function CreatePermit() {
  const [form, setForm] = useState({
    fullName: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    employer: "",
    jobTitle: "",
    permitStartDate: "",
    permitExpiryDate: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permit, setPermit] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const normalizeDate = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.passportNumber) {
      setError("Full Name and Passport Number are required");
      return;
    }

    setLoading(true);
    try {
      // If uploading image, use FormData; otherwise you can send JSON.
      const hasFile = file instanceof File;
      let payload;

      if (hasFile) {
        payload = new FormData();
        // append text fields
        const normalized = {
          ...form,
          dateOfBirth: normalizeDate(form.dateOfBirth),
          permitStartDate: normalizeDate(form.permitStartDate),
          permitExpiryDate: normalizeDate(form.permitExpiryDate),
        };
        Object.entries(normalized).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            payload.append(k, v);
          }
        });
        // append file (field name must be 'image' to match server)
        payload.append("image", file);
      } else {
        // send JSON if no file
        payload = {
          ...form,
          dateOfBirth: normalizeDate(form.dateOfBirth),
          permitStartDate: normalizeDate(form.permitStartDate),
          permitExpiryDate: normalizeDate(form.permitExpiryDate),
        };
      }

      const res = await createPermit(payload);
      setPermit(res.data.permit);
      // clear form
      setForm({
        fullName: "",
        passportNumber: "",
        nationality: "",
        dateOfBirth: "",
        employer: "",
        jobTitle: "",
        permitStartDate: "",
        permitExpiryDate: "",
      });
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create permit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#0d3b66] mb-6">
        Create New Work Permit Application
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-md space-y-5 border border-gray-100"
      >
        {/* Full Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Full Name *
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            placeholder="As in passport"
          />
        </div>

        {/* Passport + Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Passport Number *
            </label>
            <input
              name="passportNumber"
              value={form.passportNumber}
              onChange={onChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Nationality
            </label>
            <input
              name="nationality"
              value={form.nationality}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
        </div>

        {/* DOB + Job */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Date of Birth
            </label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Job Title
            </label>
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
        </div>

        {/* Employer */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Employer
          </label>
          <input
            name="employer"
            value={form.employer}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
          />
        </div>

        {/* Permit Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Permit Start Date
            </label>
            <input
              name="permitStartDate"
              type="date"
              value={form.permitStartDate}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Permit Expiry Date
            </label>
            <input
              name="permitExpiryDate"
              type="date"
              value={form.permitExpiryDate}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onFileChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#d62828] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#ba2020]"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>

      {/* Show Permit Result */}
      {permit && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#0d3b66] mb-3">
            Application Created
          </h2>
          <PermitCard permit={permit} />
          <div className="mt-4">
            <button
              onClick={() =>
                navigate(`/permit/${encodeURIComponent(permit.workPermitId)}`)
              }
              className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              View Permit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
