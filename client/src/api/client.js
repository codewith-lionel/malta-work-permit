import client from "./client";

// createPermit accepts FormData (with file) or JSON
export function createPermit(payload) {
  if (payload instanceof FormData) {
    return client.post("/permits", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return client.post("/permits", payload);
}

export function listPermits(params = {}) {
  return client.get("/permits", { params });
}

export function checkStatus(q) {
  return client.get("/permits/status", { params: { query: q } });
}

export function getPermit(id) {
  return client.get(`/permits/${encodeURIComponent(id)}`);
}

export function deletePermit(id) {
  return client.delete(`/permits/${encodeURIComponent(id)}`);
}
