const confirmationCard = document.querySelector("#confirmation-card");
const order = JSON.parse(localStorage.getItem("cafe-creme-last-order") || "null");

if (!order) {
  confirmationCard.innerHTML = `
    <p class="cafe-eyebrow">No recent order</p>
    <h1>Your order confirmation will appear here.</h1>
    <p>Choose something from our menu to get started.</p>
    <a class="btn btn-dark" href="menu.html">Browse menu</a>
  `;
} else {
  confirmationCard.innerHTML = `
    <div class="confirmation-icon">✓</div>
    <p class="cafe-eyebrow">Order confirmed</p>
    <h1>We are preparing your order.</h1>
    <p class="confirmation-lead">Thanks, ${order.customer}. Your order is safely with us and will be ready for collection at the selected time.</p>
    <div class="order-meta"><div><span>Order number</span><strong>${order.id}</strong></div><div><span>Status</span><strong class="status-pill">${order.status}</strong></div><div><span>Collection</span><strong>${order.collectionTime}</strong></div></div>
    <div class="confirmation-items"><h2>Order summary</h2>${order.items.map((item) => `<div class="confirmation-item"><span>${item.quantity} × ${item.name}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`).join("")}<div class="confirmation-total"><span>Total</span><strong>${formatCurrency(order.total)}</strong></div></div>
    <p class="confirmation-contact">We will contact you on ${order.phone} if we need anything.</p>
    <div class="confirmation-actions"><a class="btn btn-dark" href="home.html">Back to home</a><a class="btn btn-outline-dark" href="menu.html">Order again</a></div>
  `;
}
