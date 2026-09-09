/* Hydrate admin views from Spring Boot while preserving the offline demo fallback. */
(() => {
  if (!window.CafeCremeApi || !localStorage.getItem("cafe-creme-api-token")) return;
  const statuses = { ORDER_RECEIVED: "Order received", PREPARING: "Preparing", READY_FOR_PICKUP: "Ready for pickup", OUT_FOR_DELIVERY: "Out for delivery", DELIVERED: "Delivered", CANCELLED: "Cancelled" };
  const reservationStatuses = { REQUESTED: "Requested", CONFIRMED: "Confirmed", DECLINED: "Declined", CANCELLED: "Cancelled" };
  Promise.all([window.CafeCremeApi.menu(), window.CafeCremeApi.request("/admin/orders"), window.CafeCremeApi.request("/admin/reservations")]).then(([menu, orders, reservations]) => {
    localStorage.setItem("cafe-creme-menu", JSON.stringify(menu.map((item) => ({ ...item, status: item.isAvailable ? "available" : "sold-out", isPopular: item.popular }))));
    localStorage.setItem("cafe-creme-orders", JSON.stringify(orders.map((order) => ({ ...order, status: statuses[order.status] || order.status, customer: order.customer || "Customer", phone: order.phone || "", payment: order.paymentMethod, items: (order.items || []).map((item) => ({ ...item, price: item.unitPrice })) }))));
    localStorage.setItem("cafe-creme-reservations", JSON.stringify(reservations.map((item) => ({ ...item, name: item.guestName, date: item.reservationTime?.slice(0, 10), time: item.reservationTime?.slice(11, 16), status: reservationStatuses[item.status] || item.status }))));
    window.dispatchEvent(new Event("cafe-creme-api-data-ready"));
  }).catch(() => { /* keep local admin data when the API is offline */ });
})();
