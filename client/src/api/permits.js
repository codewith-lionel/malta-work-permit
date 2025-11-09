import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function createPermit(formData) {
  // multipart/form-data for image upload
  return axios.post(`${API_BASE}/permits`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
