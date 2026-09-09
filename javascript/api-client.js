/* Spring Boot API adapter. Set window.CAFE_CREME_API_BASE before loading this file. */
window.CafeCremeApi = (() => {
  const base = window.CAFE_CREME_API_BASE || "http://localhost:8080/api/v1";
  const tokenKey = "cafe-creme-api-token";
  async function request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = localStorage.getItem(tokenKey);
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${base}${path}`, { ...options, headers });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
  return {
    request,
    login: async (body) => { const result = await request("/auth/login", { method: "POST", body: JSON.stringify(body) }); localStorage.setItem(tokenKey, result.token); return result.user; },
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
    menu: (params = "") => request(`/menu${params ? `?${params}` : ""}`),
    customizations: (productId) => request(`/menu/${encodeURIComponent(productId)}/customizations`),
    checkout: (body) => request("/checkout", { method: "POST", body: JSON.stringify(body) }),
    orders: () => request("/orders"),
    reservations: () => request("/reservations"),
    createReservation: (body) => request("/reservations", { method: "POST", body: JSON.stringify(body) }),
    notifications: () => request("/notifications"),
    markNotificationRead: (id) => request(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
    paymentIntent: (orderId) => request(`/payments/intent?orderId=${encodeURIComponent(orderId)}`, { method: "POST" }),
    tracking: (orderId) => request(`/delivery/${encodeURIComponent(orderId)}/tracking`),
    clearToken: () => localStorage.removeItem(tokenKey)
  };
})();
