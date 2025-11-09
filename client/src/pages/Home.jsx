import React from "react";
import { Link } from "react-router-dom";
import mal from "../assets/mal.webp"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* --- Text Section --- */}
        <div>
          <h1 className="text-5xl font-extrabold text-[#0d3b66] leading-tight">
            Malta Work Permit Application Portal
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Apply for and track your official single work permit online — your
            gateway to opportunities in Malta.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/create"
              className="bg-[#d62828] text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-[#ba2020] transition-all"
            >
              Create a New Permit
            </Link>
            <Link
              to="/check"
              className="border border-gray-300 px-5 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Check Permit Status
            </Link>
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all">
              <h4 className="font-bold text-[#0d3b66]">How It Works</h4>
              <p className="text-sm text-gray-500 mt-2">
                Learn the step-by-step process for applying and receiving your
                Malta work permit.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all">
              <h4 className="font-bold text-[#0d3b66]">Required Documents</h4>
              <p className="text-sm text-gray-500 mt-2">
                Find the complete list of documents needed for your submission.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all">
              <h4 className="font-bold text-[#0d3b66]">FAQs</h4>
              <p className="text-sm text-gray-500 mt-2">
                Get quick answers to common questions about your application.
              </p>
            </div>
          </div>
        </div>

        {/* --- Image Section --- */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <img
              src={mal}
              alt="Valletta Skyline, Malta"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
