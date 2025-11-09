import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50  mt-10">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        {/* --- About Section --- */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Malta Work Permit Portal
          </h4>
          <p>
            Official online platform for applying and tracking work permits in
            Malta. Simplifying your employment authorization process.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-govRed">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-govRed">
                Create Permit
              </Link>
            </li>
            <li>
              <Link to="/check" className="hover:text-govRed">
                Check Status
              </Link>
            </li>
            <li>
              <a
                href="https://identitymalta.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-govRed"
              >
                Identity Malta Agency
              </a>
            </li>
          </ul>
        </div>

        {/* --- Contact Info --- */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Contact</h4>
          <p>Identity Malta Agency</p>
          <p>Valletta, Malta</p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@identitymalta.com"
              className="hover:text-govRed"
            >
              info@identitymalta.com
            </a>
          </p>
          <p>Helpline: +356 2590 4000</p>
        </div>
      </div>

      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Government of Malta. All rights reserved.
      </div>
    </footer>
  );
}
