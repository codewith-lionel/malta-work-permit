import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function createPermit(payload) {
  // If payload is FormData, DO NOT set Content-Type manually.
  return axios.post(`${API_BASE}/permits`, payload);
}

export async function listPermits({ q = "", page = 1, limit = 20 } = {}) {
  return axios.get(`${API_BASE}/permits`, { params: { q, page, limit } });
}

export async function checkStatus(query) {
  return axios.get(`${API_BASE}/permits/status`, { params: { query } });
}

export async function getPermit(id) {
  return axios.get(`${API_BASE}/permits/${encodeURIComponent(id)}`);
}

export async function deletePermit(id) {
  return axios.delete(`${API_BASE}/permits/${encodeURIComponent(id)}`);
}
