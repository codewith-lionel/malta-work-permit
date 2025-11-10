// client/src/api/permits.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api"; // <-- ensure '/api' fallback
const client = axios.create({ baseURL: API_BASE });

export async function createPermit(payload) {
  return client.post("/permits", payload);
}

export async function listPermits({ q = "", page = 1, limit = 20 } = {}) {
  return client.get("/permits", { params: { q, page, limit } });
}

export async function checkStatus(query) {
  return client.get("/permits/status", { params: { query } });
}

export async function getPermit(id) {
  return client.get(`/permits/${encodeURIComponent(id)}`);
}

export async function deletePermit(id) {
  return client.delete(`/permits/${encodeURIComponent(id)}`);
}
