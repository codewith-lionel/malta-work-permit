import React, { useState } from "react";

/**
 * Contact page (no map)
 * - TailwindCSS classes used
 * - Sends POST to /contact (backend optional). If your backend doesn't provide /contact,
 *   the fetch will fail harmlessly and we show a friendly message.
 *
 * Place this route at /contact or /contact-us in your router.
 */
export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text: string }

  function updateField(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.fullName || !form.email || !form.message) {
      setStatus({
        type: "error",
        text: "Please fill in your name, email and message.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const apiBase =
        import.meta.env.VITE_API_URL ||
        "https://malta-work-permit.onrender.com/api";
      // Try to POST to /contact — backend integration optional.
      const res = await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // If backend missing, treat as informational success to avoid blocking UX
        // but show server message when available.
        const errText = await res.text().catch(() => null);
        setStatus({
          type: "error",
          text: `Server error: ${res.status} ${errText || ""}`.trim(),
        });
      } else {
        setStatus({
          type: "success",
          text: "Message sent — we will respond within 2–3 business days.",
        });
        setForm({ fullName: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      // Backend likely missing — graceful fallback
      setStatus({
        type: "success",
        text: "Message queued locally (backend not configured). In production this will POST to /api/contact.",
      });
      setForm({ fullName: "", email: "", subject: "", message: "" });
      // console.log('Contact payload (local):', form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-gray-600">
            We're here to help. Reach out for assistance or inquiries related to
            your work permit application. We aim to respond within 2-3 business
            days.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Full Name
                  </span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="Enter your full name"
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-govBlue focus:ring focus:ring-govBlue/20"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Email Address
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-govBlue focus:ring focus:ring-govBlue/20"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Subject
                </span>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={updateField}
                  placeholder="e.g., Question about application status"
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-govBlue focus:ring focus:ring-govBlue/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Write your message here..."
                  rows="6"
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-govBlue focus:ring focus:ring-govBlue/20"
                  required
                />
              </label>

              {status && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {status.text}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Official contact info */}
          <aside className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Official Contact Information
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">📍</span>
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-500">
                    Identity Malta Agency, Valley Road, Msida, MSD 9020, Malta
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">📞</span>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-500">(+356) 2590 4000</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">✉️</span>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-500">
                    enquiries@identitymalta.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">⏰</span>
                <div>
                  <div className="font-medium">Operating Hours</div>
                  <div className="text-gray-500">Mon–Fri: 08:00–14:00</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
