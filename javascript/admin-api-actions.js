/* Persist admin actions to Spring Boot while admin.js keeps its fast local UI. */
(() => {
  if (!window.CafeCremeApi || !localStorage.getItem("cafe-creme-api-token")) return;
  const orderStatuses = { "Order received": "ORDER_RECEIVED", Preparing: "PREPARING", "Ready for pickup": "READY_FOR_PICKUP", "Out for delivery": "OUT_FOR_DELIVERY", Delivered: "DELIVERED", Cancelled: "CANCELLED" };
  document.addEventListener("click", (event) => {
    const saveStatus = event.target.closest("#save-order-status");
    if (saveStatus) {
      const id = document.querySelector("#order-status-select")?.dataset.orderId;
      const status = orderStatuses[document.querySelector("#order-status-select")?.value];
      if (id && status) window.CafeCremeApi.request(`/admin/order-status/${encodeURIComponent(id)}?status=${status}`, { method: "PATCH" }).catch(() => {});
      return;
    }
    const reservation = event.target.closest(".reservation-action");
    if (reservation) {
      const status = reservation.dataset.status === "Confirmed" ? "CONFIRMED" : "DECLINED";
      window.CafeCremeApi.request(`/admin/reservations/${encodeURIComponent(reservation.dataset.id)}/status?status=${status}`, { method: "PATCH" }).catch(() => {});
    }
  }, true);
  document.addEventListener("click", (event) => {
    const manage = event.target.closest(".view-order");
    if (manage) document.querySelector("#order-status-select")?.setAttribute("data-order-id", manage.dataset.id);
  }, true);
})();
