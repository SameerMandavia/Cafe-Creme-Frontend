const confirmationCard = document.querySelector("#confirmation-card");
const requestedOrderId = new URLSearchParams(window.location.search).get("order");
const savedOrders = window.cafeStorage?.read("cafe-creme-orders", []) || [];
const order = (requestedOrderId ? savedOrders.find((entry) => entry.id === requestedOrderId) : null) || window.cafeStorage?.read("cafe-creme-last-order", null) || null;
const escapeOrderHtml = (value = "") => { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; };

if (!order) {
  confirmationCard.innerHTML = '<p class="cafe-eyebrow">No recent order</p><h1>Your order confirmation will appear here.</h1><p>Choose something from our menu to get started.</p><a class="btn btn-dark" href="menu.html">Browse menu</a>';
} else {
  const isDelivery = order.fulfilment === "delivery";
  const method = isDelivery ? "Delivery" : "Pickup";
  const destination = isDelivery ? order.address || "Your saved delivery address" : "Cafe-Creme counter";
  const feeRow = order.deliveryFee ? `<div class="confirmation-item"><span>Delivery fee</span><strong>${formatCurrency(order.deliveryFee)}</strong></div>` : "";
  confirmationCard.innerHTML = `
    <div class="confirmation-icon" aria-hidden="true">✓</div>
    <p class="cafe-eyebrow">Order confirmed</p>
    <h1>${isDelivery ? "Your cafe favourites are on the way." : "We are preparing your order."}</h1>
    <p class="confirmation-lead">Thanks, ${escapeOrderHtml(order.customer)}. We have received your order and will keep you updated.</p>
    <div class="order-meta"><div><span>Order number</span><strong>${escapeOrderHtml(order.id)}</strong></div><div><span>${method}</span><strong class="status-pill">${escapeOrderHtml(order.collectionTime)}</strong></div><div><span>${isDelivery ? "Deliver to" : "Collect from"}</span><strong>${escapeOrderHtml(destination)}</strong></div></div>
    <div class="confirmation-items"><h2>Order summary</h2>${order.items.map((item) => `<div class="confirmation-item"><span>${item.quantity} &times; ${escapeOrderHtml(item.name)}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`).join("")}${feeRow}<div class="confirmation-total"><span>Total paid</span><strong>${formatCurrency(order.total)}</strong></div></div>
    ${order.note ? `<p class="confirmation-contact"><strong>Your note:</strong> ${escapeOrderHtml(order.note)}</p>` : ""}
    <p class="confirmation-contact">We will contact you on ${escapeOrderHtml(order.phone)} if we need anything.</p>
    <div class="confirmation-actions"><a class="btn btn-dark" href="home.html">Back to home</a><a class="btn btn-outline-dark" href="menu.html">Order again</a></div>`;
}
