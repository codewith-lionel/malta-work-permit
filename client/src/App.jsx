import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreatePermit from "./pages/CreatePermit";
import CheckPermit from "./pages/CheckPermit";
import PermitView from "./pages/PermitView";
import DeletePermit from "./pages/DeletePermit"; // ✅ import new page
import Contact from "./components/Contact";
import PermitsList from "./pages/PermitList";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePermit />} />
          <Route path="/check" element={<CheckPermit />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/permit/:id" element={<PermitView />} />
          <Route path="/view" element={<PermitsList />} />

          {/* ✅ New route for deleting permits */}
          <Route path="/delete" element={<DeletePermit />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
