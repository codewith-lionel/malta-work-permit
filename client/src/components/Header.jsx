import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md transition-all duration-200 ${
      loc.pathname === path
        ? "bg-govRed text-gray-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded overflow-hidden border border-gray-300 shadow-sm">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Malta.svg"
              alt="Malta Flag"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-govRed text-lg">
              Malta Work Permit
            </div>
            <div className="text-xs text-gray-500">
              Official Government Portal
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/create" className={linkClasses("/create")}>
            Create Permit
          </Link>
          <Link to="/check" className={linkClasses("/check")}>
            Check Status
          </Link>
          <Link to="/delete" className={linkClasses("/delete")}>
            Delete Permit
          </Link>{" "}
          {/* ✅ new link */}
          <Link to="/contact" className={linkClasses("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 flex flex-col text-sm font-medium">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`${linkClasses("/")} block text-center py-2`}
          >
            Home
          </Link>
          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className={`${linkClasses("/create")} block text-center py-2`}
          >
            Create Permit
          </Link>
          <Link
            to="/check"
            onClick={() => setMenuOpen(false)}
            className={`${linkClasses("/check")} block text-center py-2`}
          >
            Check Status
          </Link>
          <Link
            to="/delete"
            onClick={() => setMenuOpen(false)}
            className={`${linkClasses("/delete")} block text-center py-2`}
          >
            Delete Permit
          </Link>{" "}
          {/* ✅ new link */}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={`${linkClasses("/contact")} block text-center py-2`}
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
