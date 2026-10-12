const adminUser = requireAdmin();
const adminPage = document.querySelector(".admin-page");
const adminHeading = document.querySelector(".admin-heading");
const adminViews = [
  { id: "admin-overview", label: "Dashboard", element: document.querySelector('section[aria-label="Business overview"]') },
  { id: "admin-orders", label: "Orders", element: document.querySelector("#order-list")?.closest("section") },
  { id: "admin-catalog", label: "Menu", element: document.querySelector("#product-form")?.closest(".row") },
  { id: "admin-festivals", label: "Promotions", element: document.querySelector("#festival-campaign-form")?.closest("section") },
  { id: "admin-inbox", label: "Front desk", element: document.querySelector("#reservation-list")?.closest(".row") },
  { id: "admin-customers", label: "Customers", element: document.querySelector("#admin-customers") },
  { id: "admin-kitchen", label: "Kitchen", element: document.querySelector("#admin-kitchen") },
  { id: "admin-settings", label: "Settings", element: document.querySelector("#admin-settings") },
  { id: "admin-transactions", label: "Transactions", element: document.querySelector("#admin-transactions") }
].filter((view) => view.element);
adminViews.forEach((view) => { view.element.id = view.id; view.element.hidden = false; view.element.classList.add("admin-view"); });
if (adminHeading) {
  const actions = document.createElement("div"); actions.className = "admin-heading-actions";
  actions.innerHTML = '<div class="admin-report-filters"><label>From <input id="report-start" type="date" /></label><label>To <input id="report-end" type="date" /></label></div><button class="btn btn-outline-dark" id="refresh-admin" type="button">Refresh data</button><button class="btn btn-dark" id="export-admin" type="button">JSON report</button><button class="btn btn-outline-dark" id="export-csv" type="button">CSV report</button><button class="btn btn-outline-dark" id="store-toggle" type="button"></button>';
  adminHeading.appendChild(actions);
  const navigation = document.createElement("nav"); navigation.className = "admin-section-nav"; navigation.setAttribute("aria-label", "Admin sections");
  const adminViewIcons = { "admin-overview": "⌂", "admin-orders": "▣", "admin-catalog": "☕", "admin-festivals": "✦", "admin-inbox": "◌" };
  navigation.innerHTML = adminViews.map((view, index) => `<a href="#${view.id}" class="${index === 0 ? "is-active" : ""}"><span class="admin-nav-icon" aria-hidden="true">${adminViewIcons[view.id] || "•"}</span><span>${view.label}</span></a>`).join("");
  const layout = document.createElement("div"); layout.className = "admin-content-layout";
  const viewContainer = document.createElement("div"); viewContainer.className = "admin-view-container";
  adminHeading.after(layout); layout.append(navigation, viewContainer); adminViews.forEach((view) => viewContainer.appendChild(view.element));
  const activateView = (id, updateUrl = true) => { const selected = adminViews.find((view) => view.id === id) || adminViews[0]; adminViews.forEach((view) => view.element.classList.toggle("is-active", view.id === selected.id)); navigation.querySelectorAll("a").forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${selected.id}`)); if (updateUrl) history.replaceState(null, "", `#${selected.id}`); };
  navigation.addEventListener("click", (event) => { const link = event.target.closest("a"); if (!link) return; event.preventDefault(); activateView(link.getAttribute("href").slice(1)); });
  activateView(window.location.hash.slice(1), false);
  document.querySelector("#refresh-admin")?.addEventListener("click", () => { refreshAll(); showAuthStatus(document.querySelector("#admin-status"), "Dashboard data refreshed.", "success"); });
  const reportStart = document.querySelector("#report-start"); const reportEnd = document.querySelector("#report-end");
  const filteredReportOrders = () => read("cafe-creme-orders").filter((order) => (!reportStart.value || new Date(order.createdAt) >= new Date(`${reportStart.value}T00:00:00`)) && (!reportEnd.value || new Date(order.createdAt) <= new Date(`${reportEnd.value}T23:59:59`)));
  document.querySelector("#export-admin")?.addEventListener("click", () => { const reportOrders = filteredReportOrders(); const report = { generatedAt: new Date().toISOString(), period: { from: reportStart.value || null, to: reportEnd.value || null }, summary: { orders: reportOrders.length, revenue: reportOrders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + Number(order.total || 0), 0) }, orders: reportOrders, reservations: read("cafe-creme-reservations"), products: getMenuItems(), activity: read("cafe-creme-admin-activity") }; const file = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(file); link.download = `cafe-creme-report-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href); recordAdminAction("Report exported", `${reportOrders.length} orders`); });
  document.querySelector("#export-csv")?.addEventListener("click", () => { const rows = [["Order ID", "Date", "Customer", "Phone", "Fulfilment", "Status", "Total"], ...filteredReportOrders().map((order) => [order.id, order.createdAt, order.customer, order.phone, order.fulfilment || "Pickup", order.status, order.total])]; const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n"); const file = new Blob([csv], { type: "text/csv;charset=utf-8" }); const link = document.createElement("a"); link.href = URL.createObjectURL(file); link.download = `cafe-creme-orders-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(link.href); recordAdminAction("CSV report exported", `${rows.length - 1} orders`); });
  const storeToggle = document.querySelector("#store-toggle"); const updateStoreButton = () => { const isOpen = localStorage.getItem("cafe-creme-store-open") !== "false"; storeToggle.textContent = isOpen ? "Store open" : "Store closed"; storeToggle.classList.toggle("is-closed", !isOpen); }; updateStoreButton(); storeToggle.addEventListener("click", () => { const isOpen = localStorage.getItem("cafe-creme-store-open") !== "false"; localStorage.setItem("cafe-creme-store-open", String(!isOpen)); updateStoreButton(); recordAdminAction("Store status changed", !isOpen ? "Open" : "Closed"); showAuthStatus(document.querySelector("#admin-status"), !isOpen ? "Online ordering is open." : "Online ordering is paused.", "success"); });
}
const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const productSearch = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const editProductForm = document.querySelector("#edit-product-form");
const editProductModal = new bootstrap.Modal(document.querySelector("#edit-product-modal"));
const orderModal = new bootstrap.Modal(document.querySelector("#order-modal"));
const stockField = document.createElement("div"); stockField.className = "mt-3"; stockField.innerHTML = '<label class="form-label" for="product-stock">Stock quantity <span class="text-muted fw-normal">(optional)</span></label><input class="form-control" id="product-stock" name="stock" type="number" min="0" placeholder="Leave empty if not tracked" />'; productForm.insertBefore(stockField, productForm.lastElementChild);
const editStockField = document.createElement("div"); editStockField.innerHTML = '<label class="form-label">Stock quantity</label><input class="form-control mb-3" name="stock" type="number" min="0" placeholder="Leave empty if not tracked" />'; editProductForm.querySelector(".modal-body").insertBefore(editStockField, editProductForm.querySelector("[name=\"status\"]"));
function attachImagePreview(input, parent) { if (!input || !parent) return; const preview = document.createElement("div"); preview.className = "admin-image-preview"; preview.setAttribute("aria-live", "polite"); input.after(preview); const render = () => { const value = input.value.trim(); if (!value) { preview.replaceChildren(); preview.classList.remove("is-visible"); return; } preview.innerHTML = `<img alt="Product preview" loading="lazy" />`; preview.classList.add("is-visible"); const image = preview.querySelector("img"); image.src = value; image.addEventListener("error", () => { preview.textContent = "Image URL could not be loaded."; }, { once: true }); }; input.addEventListener("input", render); return { preview, render }; }
const productImagePreview = attachImagePreview(productForm.querySelector("[name=\"image\"]"), productForm);
const editImagePreview = attachImagePreview(editProductForm.querySelector("[name=\"image\"]"), editProductForm);
let openOrderId = null;
let productPage = 1;
let orderPage = 1;
const adminPageSize = 6;

function escapeHtml(value = "") { const node = document.createElement("div"); node.textContent = String(value); return node.innerHTML; }
function formatDate(value) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function read(key) {
  let values = [];
  try { values = JSON.parse(localStorage.getItem(key) || "[]"); } catch { values = []; }
  if (!Array.isArray(values)) values = [];
  return key === "cafe-creme-orders" ? values.map((order) => ({ ...order, status: order.status === "Received" ? "Order received" : order.status || "Order received" })) : values;
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function statusClass(status) { return ({ "Order received": "text-bg-warning", Preparing: "text-bg-info", "Out for delivery": "text-bg-primary", "Ready for pickup": "text-bg-primary", Delivered: "text-bg-success", Cancelled: "text-bg-secondary", Requested: "text-bg-warning", Confirmed: "text-bg-success", Declined: "text-bg-secondary", Unread: "text-bg-warning", Resolved: "text-bg-success" })[status] || "text-bg-secondary"; }
function badge(status) { return `<span class="badge ${statusClass(status)}">${escapeHtml(status)}</span>`; }
function activeOrders(orders) { return orders.filter((order) => order.status !== "Cancelled"); }
function renderAdminPager(container, id, total, page, onPageChange) { let pager = document.querySelector(`#${id}`); if (!pager) { pager = document.createElement("div"); pager.id = id; pager.className = "admin-pager"; container.after(pager); } const pages = Math.max(1, Math.ceil(total / adminPageSize)); pager.innerHTML = `<small>Showing ${total ? ((page - 1) * adminPageSize) + 1 : 0}-${Math.min(page * adminPageSize, total)} of ${total}</small><div><button class="btn btn-sm btn-outline-dark" type="button" data-page="prev" ${page <= 1 ? "disabled" : ""}>Previous</button><button class="btn btn-sm btn-outline-dark" type="button" data-page="next" ${page >= pages ? "disabled" : ""}>Next</button></div>`; pager.onclick = (event) => { const button = event.target.closest("button[data-page]"); if (!button || button.disabled) return; onPageChange(button.dataset.page === "next" ? page + 1 : page - 1); }; }
function recordAdminAction(action, detail) { const history = read("cafe-creme-admin-activity"); write("cafe-creme-admin-activity", [{ action, detail, at: new Date().toISOString(), user: adminUser?.name || "Admin" }, ...history].slice(0, 50)); }

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
  renderAdminInsights(orders);
}

function renderAdminInsights(orders) {
  const overview = document.querySelector("#admin-overview"); if (!overview) return;
  let insights = document.querySelector("#admin-insights");
  if (!insights) { insights = document.createElement("div"); insights.id = "admin-insights"; insights.className = "admin-insights"; overview.appendChild(insights); }
  const counts = {}; orders.forEach((order) => (order.items || []).forEach((item) => { counts[item.name] = (counts[item.name] || 0) + Number(item.quantity || 0); }));
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3); const max = best[0]?.[1] || 1;
  const active = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  let siteAnalytics = { totalVisits: 0, uniqueSessions: 0, pages: {}, events: {} }; try { siteAnalytics = { ...siteAnalytics, ...(JSON.parse(localStorage.getItem("cafe-creme-analytics") || "{}")) }; } catch { /* use empty analytics */ }
  const popularPage = Object.entries(siteAnalytics.pages || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";
  const conversion = siteAnalytics.totalVisits ? `${Math.min(100, ((orders.length / siteAnalytics.totalVisits) * 100)).toFixed(1)}%` : "0%";
  insights.innerHTML = `<article class="admin-insight"><span>Live fulfilment</span><strong>${active}</strong><small>orders currently in progress</small></article><article class="admin-insight admin-best-sellers"><span>Best sellers</span>${best.length ? best.map(([name, count]) => `<div><strong>${escapeHtml(name)}</strong><small>${count} sold</small><i><b style="width:${Math.round((count / max) * 100)}%"></b></i></div>`).join("") : "<small>No order data yet</small>"}</article><article class="admin-insight"><span>Customer signal</span><strong>${new Set(orders.map((order) => order.userEmail || order.phone || order.customer)).size}</strong><small>unique customers in order history</small></article><article class="admin-insight admin-visitor-insight"><span>Site reach</span><strong>${siteAnalytics.totalVisits}</strong><small>${siteAnalytics.uniqueSessions} unique sessions · ${conversion} order conversion</small><em>Most visited: ${escapeHtml(popularPage)}</em></article>`;
  const funnelSteps = [["menu_view", "Menu visits"], ["product_view", "Product views"], ["cart_add", "Added to cart"], ["checkout_view", "Checkout starts"], ["order_placed", "Orders placed"]];
  const funnelValues = funnelSteps.map(([key, label]) => [label, Number(siteAnalytics.events?.[key] || 0)]);
  let funnel = document.querySelector("#admin-funnel");
  if (!funnel) { funnel = document.createElement("article"); funnel.id = "admin-funnel"; funnel.className = "admin-funnel admin-chart-card"; overview.appendChild(funnel); }
  const funnelStart = funnelValues[0][1] || 0;
  funnel.innerHTML = `<div class="admin-chart-heading"><div><span class="admin-section-label">Conversion</span><strong>Customer funnel</strong></div><small>Current browser data</small></div><div class="admin-funnel-steps">${funnelValues.map(([label, value], index) => { const width = funnelStart ? Math.max(value ? 8 : 0, Math.round((value / funnelStart) * 100)) : 0; const rate = index && funnelValues[index - 1][1] ? `${Math.round((value / funnelValues[index - 1][1]) * 100)}%` : (index ? "0%" : "100%"); return `<div class="admin-funnel-step"><div><span>${escapeHtml(label)}</span><strong>${value}</strong></div><i class="admin-funnel-track"><b style="width:${Math.min(100, width)}%"></b></i><small>${index ? `${rate} from previous step` : "Entry sessions"}</small></div>`; }).join("")}</div>`;
  const lowStock = orders.length >= 0 ? getMenuItems().filter((item) => item.stock !== undefined && Number(item.stock) <= 5).sort((a, b) => Number(a.stock) - Number(b.stock)).slice(0, 4) : [];
  let stockAlert = document.querySelector("#admin-stock-alert");
  if (!stockAlert) { stockAlert = document.createElement("article"); stockAlert.id = "admin-stock-alert"; stockAlert.className = "admin-insight admin-stock-alert"; insights.appendChild(stockAlert); }
  stockAlert.innerHTML = `<span><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i> Inventory watch</span><strong>${lowStock.length}</strong>${lowStock.length ? `<small>${lowStock.map((item) => `${escapeHtml(item.name)}: ${item.stock}`).join(" · ")}</small>` : "<small>Everything is comfortably stocked</small>"}`;
  let quickActions = document.querySelector("#admin-quick-actions");
  if (!quickActions) { quickActions = document.createElement("article"); quickActions.id = "admin-quick-actions"; quickActions.className = "admin-quick-actions admin-chart-card"; overview.appendChild(quickActions); quickActions.addEventListener("click", (event) => { const button = event.target.closest("[data-admin-view]"); if (!button) return; document.querySelector(`.admin-section-nav a[href=\"#${button.dataset.adminView}\"]`)?.click(); }); }
  quickActions.innerHTML = `<div class="admin-chart-heading"><div><span class="admin-section-label">Shortcuts</span><strong>Quick actions</strong></div><small>Common tasks</small></div><div class="admin-quick-action-list"><button type="button" data-admin-view="admin-catalog"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add product</button><button type="button" data-admin-view="admin-orders"><i class="fa-solid fa-list-check" aria-hidden="true"></i> Review orders</button><button type="button" data-admin-view="admin-festivals"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i> Create campaign</button><button type="button" data-admin-view="admin-inbox"><i class="fa-solid fa-calendar-plus" aria-hidden="true"></i> Front desk</button></div>`;
  renderAdminAnalytics(orders);
  renderAdminActivity();
  renderAdminCustomers(orders);
}

function renderAdminActivity() {
  const overview = document.querySelector("#admin-overview"); if (!overview) return;
  let activity = document.querySelector("#admin-activity");
  if (!activity) { activity = document.createElement("article"); activity.id = "admin-activity"; activity.className = "admin-activity admin-chart-card"; overview.appendChild(activity); }
  const items = read("cafe-creme-admin-activity").slice(0, 5);
  activity.innerHTML = `<div class="admin-chart-heading"><div><span class="admin-section-label">Control</span><strong>Recent activity</strong></div><small>Admin audit trail</small></div>${items.length ? `<div class="admin-activity-list">${items.map((item) => `<div><span>${escapeHtml(item.action)}</span><small>${escapeHtml(item.detail)} · ${formatDate(item.at)}</small></div>`).join("")}</div>` : '<p class="text-muted mb-0">No actions recorded yet.</p>'}`;
}

function renderAdminCustomers(orders) {
  const overview = document.querySelector("#admin-overview"); if (!overview) return;
  let customers = document.querySelector("#admin-top-customers");
  if (!customers) { customers = document.createElement("article"); customers.id = "admin-top-customers"; customers.className = "admin-chart-card admin-customers"; overview.appendChild(customers); }
  const groups = {}; orders.forEach((order) => { const key = order.userEmail || order.phone || order.customer || "Guest"; groups[key] = groups[key] || { name: order.customer || "Guest", contact: key, orders: 0, spend: 0 }; groups[key].orders += 1; groups[key].spend += Number(order.total || 0); });
  const top = Object.values(groups).sort((a, b) => b.spend - a.spend).slice(0, 5);
  customers.innerHTML = `<div class="admin-chart-heading"><div><span class="admin-section-label">Customer intelligence</span><strong>Top customers</strong></div><small>${Object.keys(groups).length} profiles from orders</small></div>${top.length ? `<div class="admin-customer-list">${top.map((customer) => `<div><span><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.contact)}</small></span><b>${formatCurrency(customer.spend)}<small>${customer.orders} order${customer.orders === 1 ? "" : "s"}</small></b></div>`).join("")}</div>` : '<p class="text-muted mb-0">Customer profiles will appear after the first order.</p>'}`;
}

function renderAdminAnalytics(orders) {
  const overview = document.querySelector("#admin-overview"); if (!overview) return;
  let analytics = document.querySelector("#admin-analytics");
  if (!analytics) { analytics = document.createElement("div"); analytics.id = "admin-analytics"; analytics.className = "admin-analytics"; overview.appendChild(analytics); }
  const days = [...Array(7)].map((_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index)); return date; });
  const sales = days.map((date) => orders.filter((order) => order.status !== "Cancelled" && new Date(order.createdAt).toDateString() === date.toDateString()).reduce((sum, order) => sum + Number(order.total || 0), 0));
  const max = Math.max(...sales, 1);
  const statusCounts = ["Order received", "Preparing", "Out for delivery", "Delivered"].map((status) => [status, orders.filter((order) => order.status === status).length]);
  analytics.innerHTML = `<article class="admin-chart-card"><div class="admin-chart-heading"><div><span class="admin-section-label">Performance</span><strong>Sales this week</strong></div><small>Last 7 days</small></div><div class="admin-bars" role="img" aria-label="Sales for the last seven days">${sales.map((value, index) => `<div class="admin-bar-column"><span>${formatCurrency(value)}</span><i style="height:${Math.max(value ? 8 : 3, Math.round((value / max) * 100))}%"></i><small>${days[index].toLocaleDateString("en-IN", { weekday: "short" })}</small></div>`).join("")}</div></article><article class="admin-chart-card"><div class="admin-chart-heading"><div><span class="admin-section-label">Operations</span><strong>Order pipeline</strong></div><small>${orders.length} total orders</small></div><div class="admin-pipeline">${statusCounts.map(([status, count]) => `<div><span>${escapeHtml(status)}</span><strong>${count}</strong><i><b style="width:${Math.min(100, count ? Math.max(12, count / Math.max(orders.length, 1) * 100) : 0)}%"></b></i></div>`).join("")}</div></article>`;
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
  const pages = Math.max(1, Math.ceil(filtered.length / adminPageSize)); productPage = Math.min(productPage, pages); const visible = filtered.slice((productPage - 1) * adminPageSize, productPage * adminPageSize);
  document.querySelector("#product-count").textContent = `${products.length} products`;
  renderMenuSummary(products);
  productList.innerHTML = visible.length ? visible.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong>${item.isPopular ? '<span class="admin-popular-label">Popular</span>' : ''}<small class="d-block text-muted">${escapeHtml(item.category)} · ${item.stock === undefined ? "Stock not tracked" : `${item.stock} in stock`}</small></td><td>${formatCurrency(item.price)}</td><td>${escapeHtml(item.dietary)}</td><td>${badge(item.status)}</td><td class="text-end"><div class="btn-group btn-group-sm"><button class="btn btn-outline-dark edit-product" data-id="${item.id}">Edit</button><button class="btn btn-outline-secondary toggle-popular" data-id="${item.id}">${item.isPopular ? "Unfeature" : "Feature"}</button><button class="btn btn-outline-secondary toggle-product" data-id="${item.id}">${item.isAvailable ? "Mark sold out" : "Make available"}</button><button class="btn btn-outline-danger delete-product" data-id="${item.id}">Delete</button></div></td></tr>`).join("") : '<tr><td colspan="5" class="text-center text-muted py-4">No products match your search.</td></tr>';
  renderAdminPager(productList.closest(".table-responsive"), "product-pager", filtered.length, productPage, (nextPage) => { productPage = nextPage; renderProducts(); });
}

function renderMenuSummary(products) {
  const view = document.querySelector("#admin-catalog"); if (!view) return; let summary = document.querySelector("#admin-menu-summary"); if (!summary) { summary = document.createElement("div"); summary.id = "admin-menu-summary"; summary.className = "admin-menu-summary"; view.prepend(summary); } const tracked = products.filter((item) => item.stock !== undefined); summary.innerHTML = `<div><span>All items</span><strong>${products.length}</strong></div><div><span>Available</span><strong>${products.filter((item) => item.isAvailable).length}</strong></div><div><span>Sold out</span><strong>${products.filter((item) => item.status === "sold-out").length}</strong></div><div><span>Featured</span><strong>${products.filter((item) => item.isPopular).length}</strong></div><div><span>Stock tracked</span><strong>${tracked.length}</strong></div>`;
}
function sendCustomerNotification(reservation, status) { const notifications = read("cafe-creme-notifications"); notifications.unshift({ id: `NOT-${Date.now()}`, userEmail: reservation.email, title: status === "Confirmed" ? "Reservation confirmed" : "Reservation update", message: status === "Confirmed" ? `Your table for ${reservation.guests} guests on ${reservation.date} at ${reservation.time} is confirmed.` : `We could not confirm your table request for ${reservation.date} at ${reservation.time}. Please choose another time.`, type: "reservation", read: false, createdAt: new Date().toISOString() }); write("cafe-creme-notifications", notifications.slice(0, 50)); }

function renderOrders() {
  const query = document.querySelector("#order-search").value.trim().toLowerCase(); const filter = document.querySelector("#order-filter").value;
  const orders = read("cafe-creme-orders").filter((order) => !filter || order.status === filter).filter((order) => `${order.id} ${order.customer} ${order.phone}`.toLowerCase().includes(query));
  const pages = Math.max(1, Math.ceil(orders.length / adminPageSize)); orderPage = Math.min(orderPage, pages); const visible = orders.slice((orderPage - 1) * adminPageSize, orderPage * adminPageSize);
  document.querySelector("#order-list").innerHTML = visible.length ? visible.map((order) => `<tr><td><strong>${escapeHtml(order.id)}</strong><small class="d-block text-muted">${formatDate(order.createdAt)}</small></td><td>${escapeHtml(order.customer)}<small class="d-block text-muted">${escapeHtml(order.phone)}</small></td><td>${escapeHtml(order.fulfilment || "Pickup")}</td><td>${formatCurrency(order.total)}</td><td>${badge(order.status)}${order.deliveredAt ? `<small class="d-block text-muted">Delivered ${formatDate(order.deliveredAt)}</small>` : ""}</td><td class="text-end"><button class="btn btn-sm btn-outline-dark view-order" data-id="${order.id}">Manage</button></td></tr>`).join("") : '<tr><td colspan="6" class="text-center text-muted py-4">No orders found.</td></tr>';
  renderAdminPager(document.querySelector("#order-list").closest(".table-responsive"), "order-pager", orders.length, orderPage, (nextPage) => { orderPage = nextPage; renderOrders(); });
  renderOrderBoard(orders);
  bindRenderedOrderBoard();
}

function bindRenderedOrderBoard() {
  const board = document.querySelector("#admin-order-board"); if (!board) return;
  const stages = ["Order received", "Preparing", "Ready for pickup", "Out for delivery", "Delivered"];
  const cards = [...board.querySelectorAll(".admin-order-card")]; const columns = [...board.querySelectorAll(".admin-board-column")];
  cards.forEach((card) => { card.setAttribute("draggable", "true"); card.addEventListener("dragstart", (event) => { event.stopPropagation(); card.classList.add("is-dragging"); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", card.dataset.id); }); card.addEventListener("dragend", () => { card.classList.remove("is-dragging"); columns.forEach((column) => column.classList.remove("is-drop-target")); }); });
  columns.forEach((column, index) => { column.addEventListener("dragenter", (event) => { event.preventDefault(); column.classList.add("is-drop-target"); }); column.addEventListener("dragover", (event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; column.classList.add("is-drop-target"); }); column.addEventListener("dragleave", (event) => { if (!column.contains(event.relatedTarget)) column.classList.remove("is-drop-target"); }); column.addEventListener("drop", (event) => { event.preventDefault(); event.stopPropagation(); const id = event.dataTransfer.getData("text/plain"); const status = stages[index]; const order = read("cafe-creme-orders").find((item) => item.id === id); if (!order || order.status === status) return; write("cafe-creme-orders", read("cafe-creme-orders").map((item) => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item)); recordAdminAction("Order moved", `${id}: ${status}`); refreshAll(); }); });
  cards.forEach((card) => { card.setAttribute("draggable", "true"); });
  board.querySelectorAll(".admin-card-status").forEach((control) => control.remove());
}

function renderOrderBoard(orders) {
  const section = document.querySelector("#admin-orders"); if (!section) return;
  let board = document.querySelector("#admin-order-board");
  if (!board) { board = document.createElement("div"); board.id = "admin-order-board"; board.className = "admin-order-board"; section.querySelector(".card-body").prepend(board); }
  const stages = ["Order received", "Preparing", "Ready for pickup", "Out for delivery", "Delivered"];
  board.innerHTML = `<div class="admin-board-heading"><div><span class="admin-section-label">Live workflow</span><strong>Order board</strong></div><small>Drag a card to another column</small></div><div class="admin-board-columns">${stages.map((stage) => `<div class="admin-board-column"><div class="admin-board-column-heading"><span>${stage}</span><b>${orders.filter((order) => order.status === stage).length}</b></div>${orders.filter((order) => order.status === stage).slice(0, 4).map((order) => `<article class="admin-order-card"><strong>${escapeHtml(order.id)}</strong><span>${escapeHtml(order.customer)}</span><small>${formatCurrency(order.total)} · ${escapeHtml(order.fulfilment || "Pickup")}</small><button class="btn btn-sm btn-outline-dark view-order" data-id="${order.id}">Manage</button></article>`).join("") || '<small class="text-muted">No orders</small>'}</div>`).join("")}</div>`;
}

function renderReservations() {
  const items = read("cafe-creme-reservations");
  renderFrontDeskSummary();
  document.querySelector("#reservation-list").innerHTML = items.length ? items.map((item) => `<tr><td>${escapeHtml(item.name)}<small class="d-block text-muted">${escapeHtml(item.guests)}</small></td><td>${escapeHtml(item.date)}<small class="d-block text-muted">${escapeHtml(item.time)}</small></td><td>${badge(item.status)}</td><td class="text-end">${item.status === "Requested" ? `<button class="btn btn-sm btn-outline-success reservation-action" data-id="${item.id}" data-status="Confirmed">Confirm</button><button class="btn btn-sm btn-outline-danger reservation-action" data-id="${item.id}" data-status="Declined">Decline</button>` : ""}</td></tr>`).join("") : '<tr><td colspan="4" class="text-muted">No reservations yet.</td></tr>';
}

function renderMessages() {
  const items = read("cafe-creme-messages");
  document.querySelector("#message-list").innerHTML = items.length ? items.map((item) => `<tr><td>${escapeHtml(item.name)}<small class="d-block text-muted">${escapeHtml(item.email)}</small></td><td class="message-preview">${escapeHtml(item.message)}</td><td>${badge(item.status || "Unread")}</td><td class="text-end">${(item.status || "Unread") === "Unread" ? `<button class="btn btn-sm btn-outline-success message-action" data-id="${item.id}" data-status="Resolved">Resolve</button>` : `<button class="btn btn-sm btn-outline-danger message-action" data-id="${item.id}" data-status="delete">Delete</button>`}</td></tr>`).join("") : '<tr><td colspan="4" class="text-muted">No messages yet.</td></tr>';
}

function refreshAll() { renderOverview(); refreshCategoryFilter(); renderProducts(); renderOrders(); renderReservations(); renderMessages(); }
if (adminUser) document.querySelector("#admin-greeting").textContent = `Signed in as ${adminUser.name}`;

productForm.addEventListener("submit", (event) => { event.preventDefault(); const product = Object.fromEntries(new FormData(productForm)); product.price = Number(product.price); if (product.stock !== "") product.stock = Number(product.stock); else delete product.stock; product.id = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`; if (!product.name.trim() || !product.category.trim() || !product.description.trim() || product.price < 1) return showAuthStatus(document.querySelector("#admin-status"), "Complete every product field with a valid price."); saveMenuItems([...getMenuItems(), product]); recordAdminAction("Product added", product.name); productForm.reset(); showAuthStatus(document.querySelector("#admin-status"), "Product added to the menu.", "success"); refreshAll(); });
productSearch.addEventListener("input", () => { productPage = 1; renderProducts(); }); categoryFilter.addEventListener("change", () => { productPage = 1; renderProducts(); });
productList.addEventListener("click", (event) => { const button = event.target.closest("button[data-id]"); if (!button) return; const product = getMenuItems().find((item) => item.id === button.dataset.id); if (!product) return; if (button.classList.contains("delete-product")) { if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return; saveMenuItems(getMenuItems().filter((item) => item.id !== product.id)); recordAdminAction("Product deleted", product.name); refreshAll(); return; } if (button.classList.contains("toggle-popular")) { saveMenuItems(getMenuItems().map((item) => item.id === product.id ? { ...item, isPopular: !item.isPopular } : item)); recordAdminAction(product.isPopular ? "Product unfeatured" : "Product featured", product.name); refreshAll(); return; } if (button.classList.contains("toggle-product")) { saveMenuItems(getMenuItems().map((item) => item.id === product.id ? { ...item, status: item.isAvailable ? "sold-out" : "available" } : item)); recordAdminAction("Product availability changed", `${product.name}: ${product.isAvailable ? "sold out" : "available"}`); refreshAll(); return; } Object.entries(product).forEach(([key, value]) => { if (editProductForm.elements[key]) editProductForm.elements[key].value = value; }); editImagePreview?.render(); editProductModal.show(); });
editProductForm.addEventListener("submit", (event) => { event.preventDefault(); const changes = Object.fromEntries(new FormData(editProductForm)); changes.price = Number(changes.price); if (changes.stock !== "") changes.stock = Number(changes.stock); else delete changes.stock; saveMenuItems(getMenuItems().map((item) => item.id === changes.id ? { ...item, ...changes } : item)); recordAdminAction("Product updated", changes.name); editProductModal.hide(); refreshAll(); });
document.querySelector("#order-search").addEventListener("input", () => { orderPage = 1; renderOrders(); }); document.querySelector("#order-filter").addEventListener("change", () => { orderPage = 1; renderOrders(); });
document.querySelector("#order-list").addEventListener("click", (event) => { const button = event.target.closest(".view-order"); if (!button) return; const order = read("cafe-creme-orders").find((item) => item.id === button.dataset.id); openOrderId = order.id; document.querySelector("#order-status-select").value = order.status; document.querySelector("#order-detail").innerHTML = `<p><strong>${escapeHtml(order.customer)}</strong><br>${escapeHtml(order.phone)}</p><p><strong>${escapeHtml(order.fulfilment || "Pickup")}</strong><br>${escapeHtml(order.address || "Cafe collection")}</p><hr>${order.items.map((item) => `<div class="d-flex justify-content-between"><span>${item.quantity} × ${escapeHtml(item.name)}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`).join("")}<hr><div class="d-flex justify-content-between"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div><p class="mt-3 mb-0 small text-muted">${escapeHtml(order.note || "No customer note")}</p>`; orderModal.show(); });
const statusTimestampKey = { "Order received": "acceptedAt", Preparing: "preparingAt", "Out for delivery": "outForDeliveryAt", Delivered: "deliveredAt" };
const updateOrderStatus = (status) => { const changedAt = new Date().toISOString(); write("cafe-creme-orders", read("cafe-creme-orders").map((order) => { if (order.id !== openOrderId) return order; const statusTimestamps = { ...(order.statusTimestamps || {}), [status]: changedAt }; return { ...order, status, updatedAt: changedAt, statusTimestamps, ...(statusTimestampKey[status] ? { [statusTimestampKey[status]]: changedAt } : {}) }; })); recordAdminAction("Order status changed", `${openOrderId}: ${status}`); orderModal.hide(); refreshAll(); };
document.querySelector("#save-order-status").addEventListener("click", () => updateOrderStatus(document.querySelector("#order-status-select").value));
document.querySelector("#reservation-list").addEventListener("click", (event) => { const button = event.target.closest(".reservation-action"); if (!button) return; const reservation = read("cafe-creme-reservations").find((item) => item.id === button.dataset.id); if (!reservation) return; write("cafe-creme-reservations", read("cafe-creme-reservations").map((item) => item.id === button.dataset.id ? { ...item, status: button.dataset.status, updatedAt: new Date().toISOString() } : item)); sendCustomerNotification(reservation, button.dataset.status); recordAdminAction(`Reservation ${button.dataset.status.toLowerCase()}`, `${reservation.name} · ${reservation.date} ${reservation.time}`); showAuthStatus(document.querySelector("#admin-status"), `Customer notification queued for ${reservation.email}.`, "success"); refreshAll(); });
document.querySelector("#message-list").addEventListener("click", (event) => { const button = event.target.closest(".message-action"); if (!button) return; const items = read("cafe-creme-messages"); write("cafe-creme-messages", button.dataset.status === "delete" ? items.filter((item) => item.id !== button.dataset.id) : items.map((item) => item.id === button.dataset.id ? { ...item, status: "Resolved" } : item)); refreshAll(); });

const festivalIds = ["new-year", "lohri", "makar-sankranti", "pongal", "republic-day", "vasant-panchami", "valentines-day", "maha-shivratri", "ramadan", "holi", "eid-al-fitr", "ram-navami", "mahavir-jayanti", "good-friday", "easter", "ugadi", "gudi-padwa", "baisakhi", "tamil-new-year", "vishu", "bihu", "akshaya-tritiya", "buddha-purnima", "eid-al-adha", "rath-yatra", "muharram", "independence-day", "raksha-bandhan", "onam", "milad-un-nabi", "teachers-day", "janmashtami", "ganesh-chaturthi", "friendship-day", "navratri", "dussehra", "karwa-chauth", "dhanteras", "diwali", "govardhan-puja", "bhai-dooj", "chhath-puja", "childrens-day", "guru-nanak-gurpurab", "christmas", "fathers-day", "mothers-day"];
const festivalForm = document.querySelector("#festival-campaign-form");
const festivalCampaignId = document.querySelector("#festival-campaign-id");
const activeFestivalId = document.querySelector("#active-festival-id");
const festivalThemeEnabled = document.querySelector("#festival-theme-enabled");
const festivalThemeScheduled = document.querySelector("#festival-theme-scheduled");
const festivalStartDate = document.querySelector("#festival-start-date");
const festivalEndDate = document.querySelector("#festival-end-date");
const saveFestivalTheme = document.querySelector("#save-festival-theme");
const savedCampaigns = window.cafeStorage?.read("cafe-creme-festival-campaigns", {}) || {};
const defaultCampaigns = { "ganesh-chaturthi": ["Ganpati Bappa Sharing Box", "299", "10% off", "GANPATI10", "Saffron chai, cardamom bun, and a festive sweet."], diwali: ["Diwali Glow Box", "499", "15% off", "DIWALI15", "A shareable box of coffee, bakes, and festive sweetness."], holi: ["Holi Coolers Combo", "349", "10% off", "HOLI10", "Colourful coolers and playful bakery treats."], christmas: ["Christmas Bake Box", "599", "15% off", "MERRY15", "Festive bakes made for sharing."], "valentines-day": ["Made-for-two Coffee Box", "399", "10% off", "LOVE10", "Two coffees and something sweet to share."] };
const festivalLabel = (id) => id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
festivalCampaignId.innerHTML = festivalIds.map((id) => `<option value="${id}">${festivalLabel(id)}</option>`).join("");
activeFestivalId.innerHTML += festivalIds.map((id) => `<option value="${id}">${festivalLabel(id)}</option>`).join("");
const festivalImageField = document.createElement("div");
festivalImageField.className = "col-md-6";
festivalImageField.innerHTML = '<label class="form-label" for="festival-hero-image">Hero image URL <span class="text-muted fw-normal">(optional)</span></label><input class="form-control" id="festival-hero-image" type="url" placeholder="https://..." />';
festivalForm.insertBefore(festivalImageField, festivalForm.lastElementChild);
const festivalAltField = document.createElement("div");
festivalAltField.className = "col-md-6";
festivalAltField.innerHTML = '<label class="form-label" for="festival-hero-alt">Image alt text <span class="text-muted fw-normal">(optional)</span></label><input class="form-control" id="festival-hero-alt" placeholder="Describe the celebration" />';
festivalForm.insertBefore(festivalAltField, festivalForm.lastElementChild);
const festivalHeroImage = document.querySelector("#festival-hero-image");
const festivalHeroAlt = document.querySelector("#festival-hero-alt");
const festivalAdminPreview = document.createElement("div");
festivalAdminPreview.className = "admin-festival-preview";
festivalForm.after(festivalAdminPreview);
const adminThemeColors = { diwali: ["#6d251c", "#e6a52f"], holi: ["#8b285c", "#f5bf43"], christmas: ["#17634e", "#c94b3d"], "ganesh-chaturthi": ["#9d3f22", "#e3a42b"], navratri: ["#8d1d43", "#e18b2f"] };
function renderFestivalAdminPreview() {
  const id = festivalCampaignId.value;
  const values = ["#festival-offer-name", "#festival-offer-price", "#festival-offer-discount", "#festival-offer-coupon", "#festival-offer-note"].map((selector) => document.querySelector(selector).value.trim());
  const colors = adminThemeColors[id] || ["#4a2c24", "#d99058"];
  const isLive = festivalThemeEnabled.checked && activeFestivalId.value === id;
  const state = isLive ? (festivalThemeScheduled.checked ? "Scheduled" : "Live") : "Draft";
  const fallbackImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85";
  let image = fallbackImage;
  try { const candidate = new URL(festivalHeroImage.value.trim(), window.location.href); if (["http:", "https:"].includes(candidate.protocol)) image = candidate.href; } catch (error) { /* use the fallback preview image */ }
  festivalAdminPreview.innerHTML = `<div class="admin-preview-heading"><div><span class="admin-section-label">Customer-facing preview</span><strong>Festival banner</strong></div><span class="admin-publish-state ${state.toLowerCase()}">${state}</span></div><div class="admin-preview-banner" style="--preview-dark:${colors[0]};--preview-light:${colors[1]}"><div><small>${festivalLabel(id)}</small><h3>${escapeHtml(values[0] || "Seasonal Cafe Special")}</h3><p>${escapeHtml(values[4] || "Discover something special from the Cafe-Creme kitchen.")}</p>${values[1] || values[2] ? `<strong>${values[1] ? `₹${escapeHtml(values[1])}` : ""}${values[1] && values[2] ? " · " : ""}${escapeHtml(values[2])}</strong>` : ""}${values[3] ? `<span class="admin-preview-coupon">Use ${escapeHtml(values[3].toUpperCase())}</span>` : ""}</div><img src="${escapeHtml(image)}" alt="${escapeHtml(festivalHeroAlt.value.trim() || "Festive Cafe-Creme special")}" /></div>`;
  festivalAdminPreview.querySelector("img").addEventListener("error", (event) => { event.currentTarget.src = fallbackImage; });
}

function renderFrontDeskSummary() {
  const view = document.querySelector("#admin-inbox"); if (!view) return; let summary = document.querySelector("#admin-front-desk-summary"); if (!summary) { summary = document.createElement("div"); summary.id = "admin-front-desk-summary"; summary.className = "admin-front-desk-summary"; view.prepend(summary); } const reservations = read("cafe-creme-reservations"); const messages = read("cafe-creme-messages"); summary.innerHTML = `<div><span>Pending reservations</span><strong>${reservations.filter((item) => item.status === "Requested").length}</strong></div><div><span>Confirmed today</span><strong>${reservations.filter((item) => item.status === "Confirmed").length}</strong></div><div><span>Unread messages</span><strong>${messages.filter((item) => (item.status || "Unread") === "Unread").length}</strong></div>`;
}
const savedFestivalTheme = window.cafeStorage?.read("cafe-creme-active-festival", null) || { festivalId: "", enabled: false };
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
function fillFestivalForm() { const values = savedCampaigns[festivalCampaignId.value] || defaultCampaigns[festivalCampaignId.value] || ["Seasonal Cafe Special", "", "", "", "Discover something special from the Cafe-Creme kitchen."]; ["#festival-offer-name", "#festival-offer-price", "#festival-offer-discount", "#festival-offer-coupon", "#festival-offer-note"].forEach((selector, index) => { document.querySelector(selector).value = values[index] || ""; }); festivalHeroImage.value = values[5] || ""; festivalHeroAlt.value = values[6] || ""; renderFestivalAdminPreview(); }
festivalCampaignId.addEventListener("change", fillFestivalForm);
festivalForm.addEventListener("input", renderFestivalAdminPreview);
festivalThemeEnabled.addEventListener("change", renderFestivalAdminPreview);
festivalThemeScheduled.addEventListener("change", renderFestivalAdminPreview);
activeFestivalId.addEventListener("change", () => { if ([...festivalCampaignId.options].some((option) => option.value === activeFestivalId.value)) festivalCampaignId.value = activeFestivalId.value; fillFestivalForm(); });
festivalForm.addEventListener("submit", (event) => { event.preventDefault(); const id = festivalCampaignId.value; savedCampaigns[id] = [document.querySelector("#festival-offer-name").value.trim(), document.querySelector("#festival-offer-price").value.trim(), document.querySelector("#festival-offer-discount").value.trim(), document.querySelector("#festival-offer-coupon").value.trim().toUpperCase(), document.querySelector("#festival-offer-note").value.trim(), festivalHeroImage.value.trim(), festivalHeroAlt.value.trim()]; localStorage.setItem("cafe-creme-festival-campaigns", JSON.stringify(savedCampaigns)); showAuthStatus(document.querySelector("#festival-status"), "Festival offer saved in this browser.", "success"); const history = read("cafe-creme-festival-history"); write("cafe-creme-festival-history", [{ festival: festivalLabel(id), offer: savedCampaigns[id][0], at: new Date().toISOString() }, ...history].slice(0, 20)); recordAdminAction("Festival offer saved", festivalLabel(id)); renderFestivalAdminPreview(); });
const festivalThemeActions = saveFestivalTheme.parentElement;
festivalThemeActions.classList.add("festival-theme-actions");
const previewFestivalButton = document.createElement("button");
previewFestivalButton.type = "button";
previewFestivalButton.className = "btn btn-outline-dark ms-2";
previewFestivalButton.textContent = "Preview theme";
festivalThemeActions.appendChild(previewFestivalButton);
previewFestivalButton.addEventListener("click", () => { if (!activeFestivalId.value) { showAuthStatus(document.querySelector("#festival-theme-status"), "Choose a festival to preview."); return; } window.open(`home.html?festival=${encodeURIComponent(activeFestivalId.value)}`, "_blank", "noopener"); });

const renderCustomerView = () => {
  const list = document.querySelector("#customer-list"); if (!list) return;
  const query = (document.querySelector("#customer-search")?.value || "").trim().toLowerCase();
  const groups = {};
  read("cafe-creme-orders").forEach((order) => { const key = order.userEmail || order.phone || order.customer || "Guest"; groups[key] = groups[key] || { name: order.customer || "Guest", contact: key, orders: 0, spend: 0, last: order.createdAt }; groups[key].orders += 1; groups[key].spend += Number(order.total || 0); if (new Date(order.createdAt) > new Date(groups[key].last)) groups[key].last = order.createdAt; });
  const customers = Object.values(groups).filter((customer) => `${customer.name} ${customer.contact}`.toLowerCase().includes(query)).sort((a, b) => b.spend - a.spend);
  list.innerHTML = customers.length ? customers.map((customer) => `<article class="admin-customer-card"><div class="admin-customer-avatar"><i class="fa-solid fa-user" aria-hidden="true"></i></div><div><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.contact)}</small><small>Last order ${formatDate(customer.last)}</small></div><div class="admin-customer-metrics"><strong>${formatCurrency(customer.spend)}</strong><small>${customer.orders} order${customer.orders === 1 ? "" : "s"}</small></div></article>`).join("") : '<p class="text-muted">No customers match your search yet.</p>';
};
const renderKitchenView = () => {
  const queue = document.querySelector("#kitchen-queue"); if (!queue) return;
  const active = read("cafe-creme-orders").filter((order) => ["Order received", "Preparing"].includes(order.status)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  queue.innerHTML = active.length ? active.map((order) => `<article class="kitchen-order-card"><div><strong>${escapeHtml(order.id)}</strong><span>${formatDate(order.createdAt)}</span></div><h3>${escapeHtml(order.customer)}</h3><ul>${(order.items || []).map((item) => `<li><b>${item.quantity}×</b> ${escapeHtml(item.name)}</li>`).join("")}</ul><div class="kitchen-order-footer">${badge(order.status)}<button class="btn btn-sm btn-dark kitchen-advance" data-id="${order.id}" type="button">${order.status === "Order received" ? "Start preparing" : "Mark ready"}</button></div></article>`).join("") : '<div class="admin-empty-state"><i class="fa-solid fa-check-double" aria-hidden="true"></i><strong>Kitchen is clear</strong><span>No active orders need preparation.</span></div>';
};
const settingsForm = document.querySelector("#admin-settings-form");
const renderTransactions = () => {
  const list = document.querySelector("#transaction-list"); if (!list) return;
  const query = (document.querySelector("#transaction-search")?.value || "").trim().toLowerCase(); const filter = document.querySelector("#transaction-filter")?.value || "";
  const transactions = read("cafe-creme-orders").map((order) => { const method = order.payment || "Cash on delivery"; const status = order.status === "Cancelled" && method !== "Cash on delivery" ? "Review" : method === "Cash on delivery" && order.status !== "Delivered" ? "Pending" : "Paid"; return { ...order, transactionId: `TXN-${String(order.id).replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase()}`, method, paymentStatus: status }; }).filter((item) => `${item.transactionId} ${item.id} ${item.customer}`.toLowerCase().includes(query) && (!filter || item.paymentStatus === filter));
  const all = read("cafe-creme-orders"); const paid = all.filter((order) => order.status !== "Cancelled" && (order.payment || "Cash on delivery") !== "Cash on delivery").reduce((sum, order) => sum + Number(order.total || 0), 0); const pending = all.filter((order) => order.status !== "Delivered" && order.status !== "Cancelled" && (order.payment || "Cash on delivery") === "Cash on delivery").length; const review = all.filter((order) => order.status === "Cancelled" && (order.payment || "Cash on delivery") !== "Cash on delivery").length;
  document.querySelector("#transaction-total").textContent = `${formatCurrency(paid)} collected`; document.querySelector("#transaction-summary").innerHTML = `<div><span>Paid online</span><strong>${formatCurrency(paid)}</strong></div><div><span>Cash pending</span><strong>${pending}</strong></div><div><span>Needs review</span><strong>${review}</strong></div>`;
  list.innerHTML = transactions.length ? transactions.map((item) => `<tr><td><strong>${item.transactionId}</strong></td><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.customer)}</td><td><span class="transaction-method"><i class="fa-solid ${item.method === "Cash on delivery" ? "fa-money-bill" : "fa-credit-card"}" aria-hidden="true"></i>${escapeHtml(item.method)}</span></td><td><strong>${formatCurrency(item.total)}</strong></td><td><span class="transaction-status ${item.paymentStatus.toLowerCase()}">${item.paymentStatus === "Paid" ? "✓ " : ""}${item.paymentStatus}</span></td><td>${formatDate(item.createdAt)}</td></tr>`).join("") : '<tr><td colspan="7" class="text-center text-muted py-4">No transactions match your filters.</td></tr>';
};
document.querySelector("#transaction-search")?.addEventListener("input", renderTransactions); document.querySelector("#transaction-filter")?.addEventListener("change", renderTransactions);
const transactionList = document.querySelector("#transaction-list");
const transactionModal = document.createElement("div"); transactionModal.className = "transaction-detail-popover"; transactionModal.hidden = true; document.body.appendChild(transactionModal);
const decorateTransactions = () => { transactionList?.querySelectorAll("tr").forEach((row, index) => { if (row.querySelector(".transaction-view-button") || !row.children.length || row.children.length < 7) return; const orderId = row.children[1].textContent.trim(); row.dataset.orderId = orderId; const action = document.createElement("td"); action.innerHTML = `<button class="btn btn-sm btn-outline-dark transaction-view-button" type="button">Review</button>`; row.appendChild(action); }); };
if (transactionList) new MutationObserver(decorateTransactions).observe(transactionList, { childList: true });
transactionList?.addEventListener("click", (event) => { const button = event.target.closest(".transaction-view-button"); if (!button) return; const order = read("cafe-creme-orders").find((item) => item.id === button.closest("tr").dataset.orderId); if (!order) return; const method = order.payment || "Cash on delivery"; const isRefundable = order.status === "Cancelled" && method !== "Cash on delivery"; transactionModal.innerHTML = `<div class="transaction-detail-head"><strong>Transaction review</strong><button class="icon-only transaction-close" type="button" aria-label="Close">×</button></div><div class="transaction-detail-body"><span class="admin-section-label">${escapeHtml(order.id)}</span><h3>${formatCurrency(order.total)}</h3><p><strong>${escapeHtml(order.customer)}</strong><br>${escapeHtml(method)}<br>${formatDate(order.createdAt)}</p><div class="transaction-detail-status">${badge(isRefundable ? "Review" : method === "Cash on delivery" && order.status !== "Delivered" ? "Pending" : "Paid")}</div><label class="transaction-note-label">Internal note<textarea class="form-control" id="transaction-note" rows="3" placeholder="Add a finance note..."></textarea></label><div class="transaction-detail-actions"><button class="btn btn-outline-dark transaction-invoice" type="button"><i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Download invoice</button>${isRefundable ? `<button class="btn btn-dark transaction-refund" data-id="${escapeHtml(order.id)}" type="button"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Mark refund reviewed</button>` : ""}</div></div>`; transactionModal.hidden = false; transactionModal.querySelector(".transaction-close").addEventListener("click", () => { transactionModal.hidden = true; }); transactionModal.querySelector(".transaction-invoice").addEventListener("click", () => { const invoice = `Cafe-Creme\nInvoice for ${order.id}\nCustomer: ${order.customer}\nPayment: ${method}\nTotal: ${formatCurrency(order.total)}\nDate: ${formatDate(order.createdAt)}`; const file = new Blob([invoice], { type: "text/plain" }); const link = document.createElement("a"); link.href = URL.createObjectURL(file); link.download = `invoice-${order.id}.txt`; link.click(); URL.revokeObjectURL(link.href); }); transactionModal.querySelector(".transaction-refund")?.addEventListener("click", () => { write("cafe-creme-orders", read("cafe-creme-orders").map((item) => item.id === order.id ? { ...item, refundReviewedAt: new Date().toISOString() } : item)); recordAdminAction("Refund reviewed", order.id); transactionModal.hidden = true; renderTransactions(); }); });
if (settingsForm) {
  const settings = JSON.parse(localStorage.getItem("cafe-creme-admin-settings") || "{}"); Object.entries(settings).forEach(([key, value]) => { if (settingsForm.elements[key]) settingsForm.elements[key].type === "checkbox" ? settingsForm.elements[key].checked = value : settingsForm.elements[key].value = value; });
  settingsForm.addEventListener("submit", (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(settingsForm)); values.acceptReservations = settingsForm.elements.acceptReservations.checked; localStorage.setItem("cafe-creme-admin-settings", JSON.stringify(values)); recordAdminAction("Settings updated", "Store configuration saved"); showAuthStatus(document.querySelector("#settings-status"), "Store settings saved.", "success"); });
}
document.querySelector("#customer-search")?.addEventListener("input", renderCustomerView);
document.querySelector("#kitchen-queue")?.addEventListener("click", (event) => { const button = event.target.closest(".kitchen-advance"); if (!button) return; const order = read("cafe-creme-orders").find((item) => item.id === button.dataset.id); if (!order) return; const status = order.status === "Order received" ? "Preparing" : "Ready for pickup"; write("cafe-creme-orders", read("cafe-creme-orders").map((item) => item.id === order.id ? { ...item, status, updatedAt: new Date().toISOString() } : item)); recordAdminAction("Kitchen updated", `${order.id}: ${status}`); refreshAll(); renderKitchenView(); });
renderCustomerView(); renderKitchenView();
renderTransactions();
const adminNavigation = document.querySelector(".admin-section-nav");
if (adminNavigation && !adminNavigation.querySelector(".admin-sidebar-toggle")) {
  const toggle = document.createElement("button"); toggle.className = "admin-sidebar-toggle icon-only"; toggle.type = "button"; toggle.setAttribute("aria-label", "Collapse admin navigation"); toggle.innerHTML = '<i class="fa-solid fa-angles-left" aria-hidden="true"></i>';
  adminNavigation.prepend(toggle); toggle.addEventListener("click", () => { const collapsed = document.body.classList.toggle("admin-sidebar-collapsed"); toggle.setAttribute("aria-label", collapsed ? "Expand admin navigation" : "Collapse admin navigation"); toggle.innerHTML = `<i class="fa-solid ${collapsed ? "fa-angles-right" : "fa-angles-left"}" aria-hidden="true"></i>`; localStorage.setItem("cafe-creme-admin-sidebar-collapsed", String(collapsed)); });
  if (localStorage.getItem("cafe-creme-admin-sidebar-collapsed") === "true") { document.body.classList.add("admin-sidebar-collapsed"); toggle.innerHTML = '<i class="fa-solid fa-angles-right" aria-hidden="true"></i>'; toggle.setAttribute("aria-label", "Expand admin navigation"); }
}
const kitchenView = document.querySelector("#admin-kitchen");
if (kitchenView) {
  const kitchenHeading = kitchenView.querySelector(".admin-card-heading"); const modeButton = document.createElement("button"); modeButton.className = "btn btn-sm btn-outline-dark kitchen-mode-toggle"; modeButton.type = "button"; modeButton.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i> Kitchen mode'; kitchenHeading.appendChild(modeButton); modeButton.addEventListener("click", () => { const dark = document.body.classList.toggle("kitchen-mode"); modeButton.innerHTML = `<i class="fa-solid ${dark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i> ${dark ? "Light mode" : "Kitchen mode"}`; });
}
window.setInterval(() => { refreshAll(); renderCustomerView(); renderKitchenView(); renderTransactions(); renderKitchenSla(); renderReservationCalendar(); }, 30000);
fillFestivalForm();
refreshAll();

// Replace legacy symbols after the admin navigation has been rendered.
const adminFontAwesomeIcons = {
  "admin-overview": "fa-solid fa-gauge-high",
  "admin-orders": "fa-solid fa-receipt",
  "admin-catalog": "fa-solid fa-mug-hot",
  "admin-festivals": "fa-solid fa-wand-magic-sparkles",
  "admin-inbox": "fa-solid fa-concierge-bell",
  "admin-customers": "fa-solid fa-users",
  "admin-kitchen": "fa-solid fa-fire-burner",
  "admin-settings": "fa-solid fa-sliders",
  "admin-transactions": "fa-solid fa-money-bill-transfer"
};
document.querySelectorAll(".admin-section-nav a").forEach((link) => {
  const icon = link.querySelector(".admin-nav-icon");
  const iconClass = adminFontAwesomeIcons[link.getAttribute("href").slice(1)];
  link.title = link.querySelector("span:last-child")?.textContent?.trim() || "Admin section";
  if (icon && iconClass) icon.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>`;
});
const orderBoard = document.querySelector("#admin-order-board");
orderBoard?.addEventListener("click", (event) => {
  const button = event.target.closest(".view-order"); if (!button) return;
  const order = read("cafe-creme-orders").find((item) => item.id === button.dataset.id); if (!order) return;
  openOrderId = order.id; document.querySelector("#order-status-select").value = order.status;
  document.querySelector("#order-detail").innerHTML = `<p><strong>${escapeHtml(order.customer)}</strong><br>${escapeHtml(order.phone)}</p><p><strong>${escapeHtml(order.fulfilment || "Pickup")}</strong><br>${escapeHtml(order.address || "Cafe collection")}</p><hr>${(order.items || []).map((item) => `<div class="d-flex justify-content-between"><span>${item.quantity} × ${escapeHtml(item.name)}</span><strong>${formatCurrency(item.price * item.quantity)}</strong></div>`).join("")}<hr><div class="d-flex justify-content-between"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div><p class="mt-3 mb-0 small text-muted">${escapeHtml(order.note || "No customer note")}</p>`;
  orderModal.show();
});
const adminActionIcons = { "#refresh-admin": "fa-solid fa-arrows-rotate", "#export-admin": "fa-solid fa-file-code", "#export-csv": "fa-solid fa-file-csv" };
Object.entries(adminActionIcons).forEach(([selector, iconClass]) => {
  const button = document.querySelector(selector);
  if (button && !button.querySelector("i")) button.insertAdjacentHTML("afterbegin", `<i class="${iconClass}" aria-hidden="true"></i> `);
});
const notificationButton = document.createElement("button"); notificationButton.className = "btn btn-outline-dark admin-notification-button icon-only"; notificationButton.type = "button"; notificationButton.setAttribute("aria-label", "View notifications"); notificationButton.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i><span class="admin-notification-count" aria-hidden="true"></span>';
const adminActions = document.querySelector(".admin-heading-actions");
if (adminActions) { adminActions.prepend(notificationButton); const notificationPanel = document.createElement("div"); notificationPanel.className = "admin-notification-panel"; notificationPanel.hidden = true; adminActions.appendChild(notificationPanel); const updateNotifications = () => { const orders = read("cafe-creme-orders").filter((order) => !["Delivered", "Cancelled"].includes(order.status)); const reservations = read("cafe-creme-reservations").filter((item) => item.status === "Requested"); const messages = read("cafe-creme-messages").filter((item) => (item.status || "Unread") === "Unread"); const total = orders.length + reservations.length + messages.length; notificationButton.querySelector(".admin-notification-count").textContent = total || ""; notificationPanel.innerHTML = `<strong>Needs attention</strong>${total ? `<span>${orders.length} active order${orders.length === 1 ? "" : "s"}</span><span>${reservations.length} pending reservation${reservations.length === 1 ? "" : "s"}</span><span>${messages.length} unread message${messages.length === 1 ? "" : "s"}</span>` : "<span>Everything is up to date.</span>"}`; }; updateNotifications(); notificationButton.addEventListener("click", () => { notificationPanel.hidden = !notificationPanel.hidden; }); }
setTimeout(() => { const panel = document.querySelector(".admin-notification-panel"); const button = document.querySelector(".admin-notification-button"); document.addEventListener("click", (event) => { if (panel && button && !panel.contains(event.target) && !button.contains(event.target)) panel.hidden = true; }); document.addEventListener("keydown", (event) => { if (event.key === "Escape" && panel) panel.hidden = true; }); }, 0);
const renderKitchenSla = () => { const view = document.querySelector("#admin-kitchen"); if (!view) return; let sla = document.querySelector("#kitchen-sla"); if (!sla) { sla = document.createElement("div"); sla.id = "kitchen-sla"; sla.className = "kitchen-sla"; view.querySelector(".admin-view-card").insertBefore(sla, view.querySelector("#kitchen-queue")); } const active = read("cafe-creme-orders").filter((order) => ["Order received", "Preparing"].includes(order.status)); const delayed = active.filter((order) => Date.now() - new Date(order.createdAt).getTime() > 15 * 60 * 1000); sla.innerHTML = `<div><i class="fa-solid fa-stopwatch" aria-hidden="true"></i><span>Active tickets<strong>${active.length}</strong></span></div><div class="${delayed.length ? "is-alert" : ""}"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span>Over 15 minutes<strong>${delayed.length}</strong></span></div><small>Target preparation time: 15 minutes</small>`; };
const renderReservationCalendar = () => { const view = document.querySelector("#admin-inbox"); if (!view) return; let calendar = document.querySelector("#admin-reservation-calendar"); if (!calendar) { calendar = document.createElement("div"); calendar.id = "admin-reservation-calendar"; calendar.className = "admin-reservation-calendar"; view.prepend(calendar); } const items = read("cafe-creme-reservations").sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)); const grouped = items.reduce((all, item) => { all[item.date] = all[item.date] || []; all[item.date].push(item); return all; }, {}); calendar.innerHTML = `<div class="admin-chart-heading"><div><span class="admin-section-label">Front desk planner</span><strong>Reservation calendar</strong></div><small>${items.length} total requests</small></div>${items.length ? `<div class="reservation-calendar-grid">${Object.entries(grouped).map(([date, reservations]) => `<div class="reservation-day"><strong>${escapeHtml(date)}</strong>${reservations.map((item) => `<span><b>${escapeHtml(item.time)}</b>${escapeHtml(item.name)} · ${escapeHtml(item.guests)} guests</span>`).join("")}</div>`).join("")}</div>` : '<p class="text-muted mb-0">No reservations scheduled.</p>'}`; };
renderKitchenSla(); renderReservationCalendar();
