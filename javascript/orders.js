const cartStorageKey = "cafe-creme-cart";
const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "{}");
const orderItemsContainer = document.querySelector("#order-items");
const orderSummary = document.querySelector("#order-summary");
const checkoutButton = document.querySelector("#checkout-button");
const orderStatus = document.querySelector("#order-status");

function saveCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function renderMenu() {
  const groups = menuItems.reduce((result, item) => {
    result[item.category] ||= [];
    result[item.category].push(item);
    return result;
  }, {});

  orderItemsContainer.innerHTML = Object.entries(groups).map(([category, items]) => `
    <div class="order-category">
      <div class="menu-group-heading"><h2>${category}</h2><span>Collection</span></div>
      ${items.map((item) => `
        <div class="order-item">
          <div><h3>${item.name}</h3><p>${item.description}</p></div>
          <strong>${formatCurrency(item.price)}</strong>
          <button class="btn btn-sm btn-outline-dark add-to-cart" type="button" data-item-id="${item.id}">Add</button>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function getCartItems() {
  return Object.entries(cart).map(([id, quantity]) => ({
    item: menuItems.find((menuItem) => menuItem.id === id),
    quantity
  })).filter(({ item }) => item);
}

function renderCart() {
  const items = getCartItems();
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  orderSummary.innerHTML = items.length ? `
    <h2>Your order</h2>
    ${items.map(({ item, quantity }) => `
      <div class="cart-line">
        <div><strong>${item.name}</strong><small>${formatCurrency(item.price)} each</small></div>
        <div class="cart-controls"><button class="btn btn-sm btn-outline-dark decrease-item" data-item-id="${item.id}" type="button">-</button><span>${quantity}</span><button class="btn btn-sm btn-outline-dark increase-item" data-item-id="${item.id}" type="button">+</button></div>
      </div>
    `).join("")}
    <hr />
    <div class="d-flex justify-content-between"><strong>Total</strong><strong>${formatCurrency(total)}</strong></div>
    <button class="btn btn-dark w-100 mt-4" id="checkout-button" type="button">Place order</button>
  ` : `
    <h2>Your order</h2>
    <p class="empty-order">Your basket is waiting for something delicious.</p>
    <hr />
    <div class="d-flex justify-content-between"><strong>Total</strong><strong>₹0</strong></div>
    <button class="btn btn-dark w-100 mt-4" id="checkout-button" type="button" disabled>Place order</button>
  `;

  orderSummary.querySelectorAll(".increase-item").forEach((button) => button.addEventListener("click", () => updateQuantity(button.dataset.itemId, 1)));
  orderSummary.querySelectorAll(".decrease-item").forEach((button) => button.addEventListener("click", () => updateQuantity(button.dataset.itemId, -1)));
  orderSummary.querySelector("#checkout-button")?.addEventListener("click", submitOrder);
}

function updateQuantity(itemId, change) {
  cart[itemId] = (cart[itemId] || 0) + change;
  if (cart[itemId] <= 0) delete cart[itemId];
  saveCart();
  renderCart();
}

function submitOrder() {
  const payload = { items: getCartItems().map(({ item, quantity }) => ({ menuItemId: item.id, quantity })) };
  orderStatus.textContent = "Order received. We will confirm your collection time shortly.";
  orderStatus.className = "alert alert-success mt-4";
  Object.keys(cart).forEach((key) => delete cart[key]);
  saveCart();
  renderCart();
  fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
}

renderMenu();
renderCart();
orderItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");
  if (!button) return;
  updateQuantity(button.dataset.itemId, 1);
  orderStatus.textContent = "Added to your order.";
  orderStatus.className = "alert alert-info mt-4";
});
