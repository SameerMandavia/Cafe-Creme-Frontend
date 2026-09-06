const adminUser = requireAdmin();
const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const productSearch = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const editProductForm = document.querySelector("#edit-product-form");
const editProductModal = new bootstrap.Modal(document.querySelector("#edit-product-modal"));
const orderModal = new bootstrap.Modal(document.querySelector("#order-modal"));
let openOrderId = null;

function escapeHtml(value = "") { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; }
function formatDate(value) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function read(key) {
  const values = JSON.parse(localStorage.getItem(key) || "[]");
  return key === "cafe-creme-orders" ? values.map((order) => ({ ...order, status: order.status === "Received" ? "Order received" : order.status || "Order received" })) : values;
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function statusClass(status) { return ({ "Order received": "text-bg-warning", Preparing: "text-bg-info", "Out for delivery": "text-bg-primary", "Ready for pickup": "text-bg-primary", Delivered: "text-bg-success", Cancelled: "text-bg-secondary", Requested: "text-bg-warning", Confirmed: "text-bg-success", Declined: "text-bg-secondary", Unread: "text-bg-warning", Resolved: "text-bg-success" })[status] || "text-bg-secondary"; }
function badge(status) { return `<span class="badge ${statusClass(status)}">${escapeHtml(status)}</span>`; }
function activeOrders(orders) { return orders.filter((order) => order.status !== "Cancelled"); }

function renderOverview() {
  const orders = read("cafe-creme-orders"); const active = activeOrders(orders); const today = new Date().toDateString();
  const todayOrders = active.filter((order) => new Date(order.createdAt).toDateString() === today);
  const total = active.reduce((sum, order) => sum + Number(order.total || 0), 0);
  document.querySelector("#today-sales").textContent = formatCurrency(todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0));
  document.querySelector("#order-count").textContent = todayOrders.length;
  document.querySelector("#pending-count").textContent = `${active.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length} need action`;
  document.querySelector("#average-order").textContent = formatCurrency(active.length ? Math.round(total / active.length) : 0);
  document.querySelector("#order-total-label").textContent = formatCurrency(total);
  document.querySelector("#reservation-count").textContent = read("cafe-creme-reservations").filter((item) => item.status === "Requested").length;
}

function refreshCategoryFilter() {
  const current = categoryFilter.value; const categories = [...new Set(getMenuItems().map((item) => item.category))].sort();
  categoryFilter.innerHTML = `<option value="">All categories</option>${categories.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
  categoryFilter.value = categories.includes(current) ? current : "";
  document.querySelector("#category-options").innerHTML = categories.map((name) => `<option value="${escapeHtml(name)}">`).join("");
}

function renderProducts() {
  const search = productSearch.value.trim().toLowerCase(); const category = categoryFilter.value; const products = getMenuItems();
  const filtered = products.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(search) && (!category || item.category === category));
  document.querySelector("#product-count").textContent = `${products.length} products`;
  productList.innerHTML = filtered.length ? filtered.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong><small class="d-block text-muted">${escapeHtml(item.category)}</small></td><td>${formatCurrency(item.price)}</td><td>${escapeHtml(item.dietary)}</td><td>${badge(item.status)}</td><td class="text-end"><div class="btn-group btn-group-sm"><button class="btn btn-outline-dark edit-product" data-id="${item.id}">Edit</button><button class="btn btn-outline-danger delete-product" data-id="${item.id}">Delete</button></div></td></tr>`).join("") : '<tr><td colspan="5" class="text-center text-muted py-4">No products match your search.</td></tr>';
}

function renderOrders() {
  const query = document.querySelector("#order-search").value.trim().toLowerCase(); const filter = document.querySelector("#order-filter").value;
  const orders = read("cafe-creme-orders").filter((order) => !filter || order.status === filter).filter((order) => `${order.id} ${order.customer} ${order.phone}`.toLowerCase().includes(query));
  document.querySelector("#order-list").innerHTML = orders.length ? orders.map((order) => `<tr><td><strong>${escapeHtml(order.id)}</strong><small class="d-block text-muted">${formatDate(order.createdAt)}</small></td><td>${escapeHtml(order.customer)}<small class="d-block text-muted">${escapeHtml(order.phone)}</small></td><td>${escapeHtml(order.fulfilment || "Pickup")}</td><td>${formatCurrency(order.total)}</td><td>${badge(order.status)}</td><td class="text-end"><button class="btn btn-sm btn-outline-dark view-order" data-id="${order.id}">Manage</button></td></tr>`).join("") : '<tr><td colspan="6" class="text-center text-muted py-4">No orders found.</td></tr>';
}

function renderReservations() {
  const items = read("cafe-creme-reservations");
  document.querySelector("#reservation-list").innerHTML = items.length ? items.map((item) => `<tr><td>${escapeHtml(item.name)}<small class="d-block text-muted">${escapeHtml(item.guests)}</small></td><td>${escapeHtml(item.date)}<small class="d-block text-muted">${escapeHtml(item.time)}</small></td><td>${badge(item.status)}</td><td class="text-end">${item.status === "Requested" ? `<button class="btn btn-sm btn-outline-success reservation-action" data-id="${item.id}" data-status="Confirmed">Confirm</button><button class="btn btn-sm btn-outline-danger reservation-action" data-id="${item.id}" data-status="Declined">Decline</button>` : ""}</td></tr>`).join("") : '<tr><td colspan="4" class="text-muted">No reservations yet.</td></tr>';
}

function renderMessages() {
  const items = read("cafe-creme-messages");
  document.querySelector("#message-list").innerHTML = items.length ? items.map((item) => `<tr><td>${escapeHtml(item.name)}<small class="d-block text-muted">${escapeHtml(item.email)}</small></td><td class="message-preview">${escapeHtml(item.message)}</td><td>${badge(item.status || "Unread")}</td><td class="text-end">${(item.status || "Unread") === "Unread" ? `<button class="btn btn-sm btn-outline-success message-action" data-id="${item.id}" data-status="Resolved">Resolve</button>` : `<button class="btn btn-sm btn-outline-danger message-action" data-id="${item.id}" data-status="delete">Delete</button>`}</td></tr>`).join("") : '<tr><td colspan="4" class="text-muted">No messages yet.</td></tr>';
}

function refreshAll() { renderOverview(); refreshCategoryFilter(); renderProducts(); renderOrders(); renderReservations(); renderMessages(); }
if (adminUser) document.querySelector("#admin-greeting").textContent = `Signed in as ${adminUser.name}`;

productForm.addEventListener("submit", (event) => { event.preventDefault(); const product = Object.fromEntries(new FormData(productForm)); product.price = Number(product.price); product.id = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`; if (!product.name.trim() || !product.category.trim() || !product.description.trim() || product.price < 1) return showAuthStatus(document.querySelector("#admin-status"), "Complete every product field with a valid price."); saveMenuItems([...getMenuItems(), product]); productForm.reset(); showAuthStatus(document.querySelector("#admin-status"), "Product added to the menu.", "success"); refreshAll(); });
productSearch.addEventListener("input", renderProducts); categoryFilter.addEventListener("change", renderProducts);
productList.addEventListener("click", (event) => { const button = event.target.closest("button[data-id]"); if (!button) return; const product = getMenuItems().find((item) => item.id === button.dataset.id); if (button.classList.contains("delete-product")) { if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return; saveMenuItems(getMenuItems().filter((item) => item.id !== product.id)); refreshAll(); return; } Object.entries(product).forEach(([key, value]) => { if (editProductForm.elements[key]) editProductForm.elements[key].value = value; }); editProductModal.show(); });
editProductForm.addEventListener("submit", (event) => { event.preventDefault(); const changes = Object.fromEntries(new FormData(editProductForm)); changes.price = Number(changes.price); saveMenuItems(getMenuItems().map((item) => item.id === changes.id ? { ...item, ...changes } : item)); editProductModal.hide(); refreshAll(); });
document.querySelector("#order-search").addEventListener("input", renderOrders); document.querySelector("#order-filter").addEventListener("change", renderOrders);
document.querySelector("#order-list").addEventListener("click", (event) => { const button = event.target.closest(".view-order"); if (!button) return; const order = read("cafe-creme-orders").find((item) => item.id === button.dataset.id); openOrderId = order.id; document.querySelector("#order-status-select").value = order.status; document.querySelector("#order-detail").innerHTML = `<p><strong>${escapeHtml(order.customer)}</strong><br>${escapeHtml(order.phone)}</p><p><strong>${escapeHtml(order.fulfilment || "Pickup")}</strong><br>${escapeHtml(order.address || "Cafe collection")}</p><hr>${order.items.map((item) => `<div class="d-flex justify-content-between"><span>${item.quantity} × ${escapeHtml(item.name)}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`).join("")}<hr><div class="d-flex justify-content-between"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div><p class="mt-3 mb-0 small text-muted">${escapeHtml(order.note || "No customer note")}</p>`; orderModal.show(); });
document.querySelector("#save-order-status").addEventListener("click", () => { const status = document.querySelector("#order-status-select").value; write("cafe-creme-orders", read("cafe-creme-orders").map((order) => order.id === openOrderId ? { ...order, status } : order)); orderModal.hide(); refreshAll(); });
document.querySelector("#reservation-list").addEventListener("click", (event) => { const button = event.target.closest(".reservation-action"); if (!button) return; write("cafe-creme-reservations", read("cafe-creme-reservations").map((item) => item.id === button.dataset.id ? { ...item, status: button.dataset.status } : item)); refreshAll(); });
document.querySelector("#message-list").addEventListener("click", (event) => { const button = event.target.closest(".message-action"); if (!button) return; const items = read("cafe-creme-messages"); write("cafe-creme-messages", button.dataset.status === "delete" ? items.filter((item) => item.id !== button.dataset.id) : items.map((item) => item.id === button.dataset.id ? { ...item, status: "Resolved" } : item)); refreshAll(); });

const festivalIds = ["ganesh-chaturthi", "diwali", "holi", "christmas", "valentines-day"];
const festivalForm = document.querySelector("#festival-campaign-form");
const festivalCampaignId = document.querySelector("#festival-campaign-id");
const activeFestivalId = document.querySelector("#active-festival-id");
const festivalThemeEnabled = document.querySelector("#festival-theme-enabled");
const festivalThemeScheduled = document.querySelector("#festival-theme-scheduled");
const festivalStartDate = document.querySelector("#festival-start-date");
const festivalEndDate = document.querySelector("#festival-end-date");
const saveFestivalTheme = document.querySelector("#save-festival-theme");
const savedCampaigns = JSON.parse(localStorage.getItem("cafe-creme-festival-campaigns") || "{}");
const defaultCampaigns = { "ganesh-chaturthi": ["Ganpati Bappa Sharing Box", "299", "10% off", "GANPATI10", "Saffron chai, cardamom bun, and a festive sweet."], diwali: ["Diwali Glow Box", "499", "15% off", "DIWALI15", "A shareable box of coffee, bakes, and festive sweetness."], holi: ["Holi Coolers Combo", "349", "10% off", "HOLI10", "Colourful coolers and playful bakery treats."], christmas: ["Christmas Bake Box", "599", "15% off", "MERRY15", "Festive bakes made for sharing."], "valentines-day": ["Made-for-two Coffee Box", "399", "10% off", "LOVE10", "Two coffees and something sweet to share."] };
festivalCampaignId.innerHTML = festivalIds.map((id) => `<option value="${id}">${id.replaceAll("-", " ")}</option>`).join("");
activeFestivalId.innerHTML += festivalIds.map((id) => `<option value="${id}">${id.replaceAll("-", " ")}</option>`).join("");
const savedFestivalTheme = JSON.parse(localStorage.getItem("cafe-creme-active-festival") || "null") || { festivalId: "", enabled: false };
activeFestivalId.value = savedFestivalTheme.festivalId || "";
festivalThemeEnabled.checked = savedFestivalTheme.enabled === true && Boolean(savedFestivalTheme.festivalId);
festivalThemeScheduled.checked = savedFestivalTheme.schedule?.enabled === true;
festivalStartDate.value = savedFestivalTheme.schedule?.start || "";
festivalEndDate.value = savedFestivalTheme.schedule?.end || "";
saveFestivalTheme.addEventListener("click", () => {
  const scheduled = festivalThemeScheduled.checked;
  if (scheduled && (!festivalStartDate.value || !festivalEndDate.value || festivalEndDate.value < festivalStartDate.value)) {
    showAuthStatus(document.querySelector("#festival-theme-status"), "Choose a valid start and end date for the schedule.");
    return;
  }
  const setting = { festivalId: activeFestivalId.value, enabled: festivalThemeEnabled.checked && Boolean(activeFestivalId.value), schedule: { enabled: scheduled, start: festivalStartDate.value, end: festivalEndDate.value } };
  localStorage.setItem("cafe-creme-active-festival", JSON.stringify(setting));
  window.dispatchEvent(new CustomEvent("cafe-creme-festival-change", { detail: { festivalId: setting.enabled ? setting.festivalId : "" } }));
  showAuthStatus(document.querySelector("#festival-theme-status"), setting.enabled ? "Festival theme is live. Open customer pages will update automatically." : "Festival theme hidden across the site.", "success");
});
function fillFestivalForm() { const values = savedCampaigns[festivalCampaignId.value] || defaultCampaigns[festivalCampaignId.value]; ["#festival-offer-name", "#festival-offer-price", "#festival-offer-discount", "#festival-offer-coupon", "#festival-offer-note"].forEach((selector, index) => { document.querySelector(selector).value = values[index] || ""; }); }
festivalCampaignId.addEventListener("change", fillFestivalForm);
festivalForm.addEventListener("submit", (event) => { event.preventDefault(); savedCampaigns[festivalCampaignId.value] = [document.querySelector("#festival-offer-name").value, document.querySelector("#festival-offer-price").value, document.querySelector("#festival-offer-discount").value, document.querySelector("#festival-offer-coupon").value.toUpperCase(), document.querySelector("#festival-offer-note").value]; localStorage.setItem("cafe-creme-festival-campaigns", JSON.stringify(savedCampaigns)); showAuthStatus(document.querySelector("#festival-status"), "Festival offer saved. Refresh the customer pages to publish it.", "success"); });
fillFestivalForm();
refreshAll();
