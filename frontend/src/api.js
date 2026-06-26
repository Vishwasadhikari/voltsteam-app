const API_BASE_URL = "https://k4jz8nywj8.execute-api.eu-north-1.amazonaws.com"

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getLivePower: () => request("/api/v1/dashboard/live"),
  getHistory: (period) => request(`/api/v1/analytics/history?period=${period}`),
  getDevices: () => request("/api/v1/devices"),
  updateDevice: (id, payload) =>
    request(`/api/v1/devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  getBilling: () => request("/api/v1/billing/summary"),
};
