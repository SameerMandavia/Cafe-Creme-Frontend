const ordersList = document.querySelector("#orders-list");
const ordersEmpty = document.querySelector("#orders-empty");
const ordersCurrentUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null");
let orders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]").filter((order) => !ordersCurrentUser?.email || !order.userEmail || order.userEmail === ordersCurrentUser.email);
const ordersToolbar = document.querySelector("#orders-toolbar");
const ordersSearch = document.querySelector("#orders-search");
let activeFilter = "all";
const escapeOrder = (value = "") => { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; };
const statusSteps = ["Order received", "Preparing", "Out for delivery", "Delivered"];
const isActive = (status) => !["Delivered", "Cancelled"].includes(status);
const getOrderSteps = (order) => order.fulfilment === "delivery" ? statusSteps : ["Order received", "Preparing", "Ready for pickup", "Collected"];
const formatOrderDate = (value) => { if (!value) return "Recent order"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Recent order" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };

function renderOverview() {
  document.querySelector("#orders-total-count").textContent = orders.length;
  document.querySelector("#orders-active-count").textContent = orders.filter((order) => isActive(order.status || "Order received")).length;
  document.querySelector("#orders-total-spend").textContent = formatCurrency(orders.reduce((total, order) => total + Number(order.total || 0), 0));
}

function renderOrderCard(order) {
  const status = order.status || "Order received";
  const orderSteps = getOrderSteps(order);
  const currentStep = status === "Cancelled" ? -1 : status === "Delivered" ? orderSteps.length - 1 : Math.max(0, orderSteps.indexOf(status));
  const itemCount = (order.items || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
  const items = (order.items || []).map((item) => `${item.quantity} x ${escapeOrder(item.name)}`).join(" / ");
  const canTrack = isActive(status);
  const firstImage = (order.items || []).map((orderItem) => getMenuItems().find((item) => item.name === orderItem.name)?.image).find(Boolean);
  const timeline = status === "Cancelled" ? `<div class="cancelled-state"><strong>Order cancelled</strong><span>This order will remain in your history.</span></div>` : `<div class="order-timeline" aria-label="Order progress">${orderSteps.map((step, index) => `<span class="${index <= currentStep ? "is-complete" : ""} ${index === currentStep ? "is-current" : ""}"><b>${index < currentStep ? "&#x2713;" : index + 1}</b><em>${step}</em></span>`).join("")}</div>`;
  const trackTitle = status === "Ready for pickup" ? "Ready to collect" : status === "Delivered" ? "Delivered successfully" : "On its way to you";
  const trackEta = status === "Ready for pickup" ? "Ready now" : status === "Delivered" ? "Completed" : status === "Preparing" ? "15-25 min" : "ETA 25-35 min";
  return `<article class="order-history-card" data-order-id="${escapeOrder(order.id)}"><div class="order-history-head"><div class="order-history-title">${firstImage ? `<img src="${escapeOrder(firstImage)}" alt="" width="64" height="64" loading="lazy" />` : ""}<div><span class="order-history-id">${escapeOrder(order.id)}</span><h2>${escapeOrder(order.fulfilment === "delivery" ? "Delivery order" : "Pickup order")}</h2><small>${formatOrderDate(order.createdAt)}</small></div></div><div class="order-total-block"><strong>${formatCurrency(order.total)}</strong><span class="status-pill status-${status.toLowerCase().replaceAll(" ", "-")}">${escapeOrder(status)}</span></div></div><p class="order-history-meta">${escapeOrder(order.collectionTime || "Scheduled")}${order.address ? ` / ${escapeOrder(order.address)}` : ""}</p>${timeline}<p class="order-history-items"><strong>${itemCount} item${itemCount === 1 ? "" : "s"}</strong> / ${items}</p><div class="order-history-actions">${canTrack ? `<button class="btn btn-dark btn-sm track-order" type="button" data-order-id="${escapeOrder(order.id)}">${order.fulfilment === "delivery" ? "Track order" : "View pickup status"}</button>` : ""}<button class="btn btn-outline-dark btn-sm reorder-button" type="button" data-order-id="${escapeOrder(order.id)}">Order again</button></div><details class="order-receipt"><summary>View order details</summary><div class="receipt-lines">${(order.items || []).map((item) => `<div><span>${item.quantity} x ${escapeOrder(item.name)}</span><strong>${formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</strong></div>`).join("")}<hr /><div><span>Item total</span><strong>${formatCurrency(order.subtotal || order.total)}</strong></div><div><span>Delivery fee</span><strong>${order.deliveryFee ? formatCurrency(order.deliveryFee) : "Free"}</strong></div><div class="receipt-total"><span>Paid total</span><strong>${formatCurrency(order.total)}</strong></div><p>${escapeOrder(order.payment || "Payment at checkout")} / ${escapeOrder(order.phone || "No phone number")}</p></div></details><div class="order-track-panel d-none" data-track-panel="${escapeOrder(order.id)}"><div class="track-panel-head"><div><span class="order-history-id">${order.fulfilment === "delivery" ? "Live delivery view" : "Pickup status"}</span><h3>${trackTitle}</h3></div><strong>${trackEta}</strong></div>${order.fulfilment === "delivery" ? `<div class="track-map"><span class="track-map-cafe">Cafe</span><span class="track-route"></span><span class="track-map-home">You</span><span class="track-rider"></span></div><p class="track-address">${escapeOrder(order.address || "Your selected delivery location")}</p>` : `<div class="pickup-status-box"><strong>Collect from Cafe-Creme</strong><span>Have your order number ${escapeOrder(order.id)} ready at the counter.</span></div>`}<small class="track-demo-note">Demo status view - connect this panel to live order and courier updates when your backend is ready.</small></div></article>`;
}

function renderOrders() {
  if (!orders.length) { ordersEmpty.classList.remove("d-none"); return; }
  ordersToolbar.classList.remove("d-none");
  const query = ordersSearch.value.trim().toLowerCase();
  const visibleOrders = orders.filter((order) => { const status = order.status || "Order received"; const matchesFilter = activeFilter === "all" || (activeFilter === "active" ? isActive(status) : status === activeFilter); const matchesSearch = `${order.id} ${(order.items || []).map((item) => item.name).join(" ")}`.toLowerCase().includes(query); return matchesFilter && matchesSearch; });
  ordersList.innerHTML = visibleOrders.map(renderOrderCard).join("") || `<div class="orders-no-results"><strong>No matching orders</strong><span>Try a different search or filter.</span><button class="btn btn-link" id="clear-order-filters" type="button">Clear filters</button></div>`;
  ordersList.querySelectorAll(".order-history-actions").forEach((actions) => { const card = actions.closest(".order-history-card"); const button = document.createElement("button"); button.className = "btn btn-link btn-sm receipt-button"; button.type = "button"; button.dataset.orderId = card.dataset.orderId; button.textContent = "View receipt"; actions.appendChild(button); });
}

function reorder(orderId) {
  const order = orders.find((item) => item.id === orderId); if (!order) return;
  const cart = JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}"); const available = new Set(getMenuItems().filter((item) => item.isAvailable).map((item) => item.id));
  (order.items || []).forEach((orderItem) => { const item = getMenuItems().find((entry) => entry.name === orderItem.name); if (item && available.has(item.id)) cart[item.id] = (cart[item.id] || 0) + Number(orderItem.quantity || 1); });
  localStorage.setItem("cafe-creme-cart", JSON.stringify(cart)); window.location.href = "cart.html";
}

renderOverview(); renderOrders();
window.addEventListener("storage", (event) => { if (event.key !== "cafe-creme-orders") return; orders = JSON.parse(event.newValue || "[]"); renderOverview(); renderOrders(); });
ordersSearch.addEventListener("input", renderOrders);
document.querySelectorAll(".order-filter").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; document.querySelectorAll(".order-filter").forEach((item) => item.classList.toggle("is-active", item === button)); renderOrders(); }));
ordersList.addEventListener("click", (event) => {
  const trackButton = event.target.closest(".track-order");
  if (trackButton) { const panel = document.querySelector(`[data-track-panel="${trackButton.dataset.orderId}"]`); if (!panel) return; const isHidden = panel.classList.toggle("d-none"); trackButton.textContent = isHidden ? "Track order" : "Hide tracking"; if (!isHidden) panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
  const reorderButton = event.target.closest(".reorder-button"); if (reorderButton) reorder(reorderButton.dataset.orderId);
  const receiptButton = event.target.closest(".receipt-button"); if (receiptButton) window.location.href = `order-success.html?order=${encodeURIComponent(receiptButton.dataset.orderId)}`;
  const clearButton = event.target.closest("#clear-order-filters"); if (clearButton) { activeFilter = "all"; ordersSearch.value = ""; document.querySelectorAll(".order-filter").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === "all")); renderOrders(); }
});
