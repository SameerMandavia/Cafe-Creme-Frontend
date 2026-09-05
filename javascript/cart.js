const cartKey = "cafe-creme-cart";
const cartItemsContainer = document.querySelector("#cart-items");
const cartContent = document.querySelector("#cart-content");
const emptyCart = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutStatus = document.querySelector("#checkout-status");
const cart = JSON.parse(localStorage.getItem(cartKey) || "{}");
const sessionUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null");
const registeredUsers = JSON.parse(localStorage.getItem("cafe-creme-users") || "[]");
const checkoutUser = registeredUsers.find((user) => user.email === sessionUser?.email) || sessionUser;

if (checkoutUser) {
  document.querySelector("#checkout-name").value = checkoutUser.name || "";
  document.querySelector("#checkout-phone").value = checkoutUser.phone || "";
} else {
  cartContent.classList.add("d-none");
  emptyCart.classList.remove("d-none");
  emptyCart.innerHTML = '<h2>Login required</h2><p>Log in to view your cart and continue to checkout.</p><a class="btn btn-dark" href="login.html">Login to continue</a>';
}

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  document.querySelector("#cart-count").textContent = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function getItems() {
  return Object.entries(cart).map(([id, quantity]) => ({ item: getMenuItems().find((product) => product.id === id), quantity })).filter(({ item }) => item);
}

function renderCart() {
  if (!checkoutUser) return;
  const items = getItems();
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const hasItems = items.length > 0;

  cartContent.classList.toggle("d-none", !hasItems);
  emptyCart.classList.toggle("d-none", hasItems);
  cartTotal.textContent = formatCurrency(total);
  cartItemsContainer.innerHTML = items.map(({ item, quantity }) => `
    <div class="cart-product">
      <div><h2>${item.name}</h2><p>${item.description}</p><strong>${formatCurrency(item.price)}</strong></div>
      <div class="cart-controls"><button class="btn btn-sm btn-outline-dark decrease-cart" data-id="${item.id}" type="button">-</button><span>${quantity}</span><button class="btn btn-sm btn-outline-dark increase-cart" data-id="${item.id}" type="button">+</button></div>
    </div>
  `).join("");
}

cartItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const change = button.classList.contains("increase-cart") ? 1 : -1;
  cart[button.dataset.id] = (cart[button.dataset.id] || 0) + change;
  if (cart[button.dataset.id] <= 0) delete cart[button.dataset.id];
  saveCart();
  renderCart();
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const items = getItems();
  if (!items.length) return;
  const details = Object.fromEntries(new FormData(checkoutForm).entries());
  const order = {
    id: `CC-${Date.now().toString().slice(-6)}`,
    customer: details.name,
    phone: details.phone,
    collectionTime: details.collectionTime,
    items: items.map(({ item, quantity }) => ({ name: item.name, price: item.price, quantity })),
    total: items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0),
    status: "Received",
    createdAt: new Date().toISOString()
  };
  const orders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]");
  orders.unshift(order);
  localStorage.setItem("cafe-creme-orders", JSON.stringify(orders));
  localStorage.setItem("cafe-creme-last-order", JSON.stringify(order));
  Object.keys(cart).forEach((key) => delete cart[key]);
  saveCart();
  window.location.href = "order-success.html";
});

renderCart();
