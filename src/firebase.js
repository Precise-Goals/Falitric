// firebase.js — Faltric Custom Backend API Client
// Transformed from Firebase SDK to our Express Server

export const API_BASE =
  import.meta.env.DEV
    ? "http://localhost:3000/api"
    : import.meta.env.VITE_API_BASE_URL || "/api";

export const ref = (database, path) => path;

export const get = async (pathRef, queryParams = {}) => {
  const url = new URL(`${API_BASE}/db/${pathRef}`);
  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams[key]),
  );

  const res = await fetch(url);
  if (res.status === 404) return { exists: () => false, val: () => null };
  if (!res.ok) throw new Error("Failed to get data");
  const data = await res.json();
  return { exists: () => data !== null && data !== undefined, val: () => data };
};

export const set = async (pathRef, data) => {
  const res = await fetch(`${API_BASE}/db/${pathRef}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to set data");
  return res.json();
};

export const update = async (pathRef, data) => {
  const res = await fetch(`${API_BASE}/db/${pathRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update data");
  return res.json();
};

export const push = async (pathRef, data) => {
  const chars =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const newPath = `${pathRef}/${autoId}`;

  if (data !== undefined) {
    await set(newPath, data);
  }

  // Return an object that looks like a Firebase Reference
  return {
    key: autoId,
    toString: () => newPath,
    // Allow it to be used as a pathRef in other calls
    [Symbol.toPrimitive]: () => newPath,
  };
};

export const remove = async (pathRef) => {
  const res = await fetch(`${API_BASE}/db/${pathRef}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove data");
  return res.json();
};

export const onValue = (pathRef, callback) => {
  const eventSource = new EventSource(`${API_BASE}/stream/${pathRef}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback({
        exists: () => data !== null && data !== undefined,
        val: () => data,
      });
    } catch (e) {
      console.error("Error parsing SSE data", e);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
  };

  // Return unsubscribe function
  return () => {
    eventSource.close();
  };
};

export const database = {}; // Mock object just in case it's passed around
