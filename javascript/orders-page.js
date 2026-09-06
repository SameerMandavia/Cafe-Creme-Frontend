const ordersList = document.querySelector("#orders-list");
const ordersEmpty = document.querySelector("#orders-empty");
const orders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]");
const ordersToolbar = document.querySelector("#orders-toolbar");
const ordersSearch = document.querySelector("#orders-search");
let activeFilter = "all";
const escapeOrder = (value = "") => { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; };
const statusSteps = ["Order received", "Preparing", "Out for delivery", "Delivered"];
function renderOrders() {
  if (!orders.length) { ordersEmpty.classList.remove("d-none"); return; }
  ordersToolbar.classList.remove("d-none");
  const query = ordersSearch.value.trim().toLowerCase();
  const visibleOrders = orders.filter((order) => { const status = order.status || "Order received"; const matchesFilter = activeFilter === "all" || (activeFilter === "active" ? !["Delivered", "Cancelled"].includes(status) : status === activeFilter); const matchesSearch = `${order.id} ${(order.items || []).map((item) => item.name).join(" ")}`.toLowerCase().includes(query); return matchesFilter && matchesSearch; });
  ordersList.innerHTML = visibleOrders.map((order) => {
    const status = order.status || "Order received";
    const currentStep = Math.max(0, statusSteps.indexOf(status));
    const items = (order.items || []).map((item) => `${item.quantity} × ${escapeOrder(item.name)}`).join(" · ");
    const canTrack = order.fulfilment === "delivery" && status !== "Delivered" && status !== "Cancelled";
    return `<article class="order-history-card"><div class="order-history-head"><div><span class="order-history-id">${escapeOrder(order.id)}</span><h2>${escapeOrder(order.fulfilment === "delivery" ? "Delivery order" : "Pickup order")}</h2></div><strong>${formatCurrency(order.total)}</strong></div><p class="order-history-meta">${escapeOrder(order.collectionTime || "Scheduled")}${order.address ? ` · ${escapeOrder(order.address)}` : ""}</p><div class="order-timeline">${statusSteps.map((step, index) => `<span class="${index <= currentStep ? "is-complete" : ""}"><b>${index < currentStep ? "✓" : index + 1}</b>${step}</span>`).join("")}</div><p class="order-history-items">${items}</p><div class="order-history-actions">${canTrack ? `<button class="btn btn-dark btn-sm track-order" type="button" data-order-id="${escapeOrder(order.id)}">Track order</button>` : ""}<a class="btn btn-outline-dark btn-sm" href="menu.html">Order again</a><a class="btn btn-outline-dark btn-sm" href="order-success.html">View receipt</a></div><div class="order-track-panel d-none" data-track-panel="${escapeOrder(order.id)}"><div class="track-panel-head"><div><span class="order-history-id">Live order view</span><h3>${escapeOrder(status === "Delivered" ? "Delivered successfully" : "On its way to you")}</h3></div><strong>${status === "Delivered" ? "Delivered" : "ETA 25–35 min"}</strong></div><div class="track-map"><span class="track-map-cafe">Cafe</span><span class="track-route"></span><span class="track-map-home">You</span><span class="track-rider">●</span></div><p class="track-address">${escapeOrder(order.address || "Your selected delivery location")}</p><small class="track-demo-note">Demo tracking view — connect this panel to live courier updates when your backend is ready.</small></div></article>`;
  }).join("") || `<div class="orders-no-results"><strong>No matching orders</strong><span>Try a different search or filter.</span></div>`;
}
renderOrders();
ordersSearch.addEventListener("input", renderOrders);
document.querySelectorAll(".order-filter").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; document.querySelectorAll(".order-filter").forEach((item) => item.classList.toggle("is-active", item === button)); renderOrders(); }));
ordersList.addEventListener("click", (event) => { const button = event.target.closest(".track-order"); if (!button) return; const panel = document.querySelector(`[data-track-panel="${button.dataset.orderId}"]`); if (!panel) return; const isHidden = panel.classList.toggle("d-none"); button.textContent = isHidden ? "Track order" : "Hide tracking"; if (!isHidden) panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
