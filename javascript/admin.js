const adminUser = requireAdmin();
const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");
const adminGreeting = document.querySelector("#admin-greeting");
const productSearch = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const editProductForm = document.querySelector("#edit-product-form");
const editProductModal = new bootstrap.Modal(document.querySelector("#edit-product-modal"));

if (adminUser) {
  adminGreeting.textContent = `Signed in as ${adminUser.name}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));
}

function renderActivity() {
  const orders = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]");
  const reservations = JSON.parse(localStorage.getItem("cafe-creme-reservations") || "[]");
  const messages = JSON.parse(localStorage.getItem("cafe-creme-messages") || "[]");
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  document.querySelector("#order-count").textContent = orders.length;
  document.querySelector("#reservation-count").textContent = reservations.length;
  document.querySelector("#order-total-label").textContent = formatCurrency(total);
  document.querySelector("#order-list").innerHTML = orders.length ? orders.slice(0, 5).map((order) => `<tr><td>${order.id}</td><td>${order.customer}</td><td>${formatCurrency(order.total)}</td><td><span class="badge text-bg-success">${order.status}</span></td></tr>`).join("") : '<tr><td class="text-muted" colspan="4">No orders yet.</td></tr>';
  document.querySelector("#reservation-list").innerHTML = reservations.length ? reservations.slice(0, 5).map((reservation) => `<tr><td>${reservation.name}</td><td>${formatDate(reservation.date)}<small class="d-block text-muted">${reservation.time}</small></td><td><span class="badge text-bg-warning">${reservation.status}</span></td></tr>`).join("") : '<tr><td class="text-muted" colspan="3">No reservations yet.</td></tr>';
  document.querySelector("#message-list").innerHTML = messages.length ? messages.slice(0, 5).map((message) => `<tr><td>${message.name}</td><td>${message.email}</td><td>${message.message}</td><td>${formatDate(message.createdAt)}</td></tr>`).join("") : '<tr><td class="text-muted" colspan="4">No messages yet.</td></tr>';
}

function renderProducts() {
  const products = getMenuItems();
  const searchTerm = productSearch.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(searchTerm);
    return matchesSearch && (!selectedCategory || product.category === selectedCategory);
  });

  document.querySelector("#product-count").textContent = `${products.length} products`;
  productList.innerHTML = filteredProducts.length ? filteredProducts.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatCurrency(product.price)}</td>
      <td><span class="badge ${product.isAvailable ? "text-bg-success" : "text-bg-secondary"}">${product.isAvailable ? "Available" : "Hidden"}</span></td>
      <td class="text-end"><div class="btn-group btn-group-sm" role="group" aria-label="Actions for ${product.name}"><button class="btn btn-outline-dark edit-product" data-product-id="${product.id}" type="button">Edit</button><button class="btn btn-outline-secondary toggle-product" data-product-id="${product.id}" type="button">${product.isAvailable ? "Hide" : "Show"}</button><button class="btn btn-outline-danger delete-product" data-product-id="${product.id}" type="button">Delete</button></div></td>
    </tr>
  `).join("") : `<tr><td class="text-center text-muted py-4" colspan="5">No products match your search.</td></tr>`;
}

function refreshCategoryFilter() {
  const currentCategory = categoryFilter.value;
  const categories = [...new Set(getMenuItems().map((product) => product.category))].sort((first, second) => first.localeCompare(second));
  const categoryOptions = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
  categoryFilter.innerHTML = `<option value="">All categories</option>${categoryOptions}`;
  categoryFilter.value = categories.includes(currentCategory) ? currentCategory : "";
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const product = Object.fromEntries(formData.entries());
  product.id = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  product.price = Number(product.price);

  if (!product.name || !product.category || !product.description || !product.price || product.price < 1) {
    showAuthStatus(document.querySelector("#admin-status"), "Complete every product field with a valid price.");
    return;
  }

  product.isAvailable = true;
  saveMenuItems([...getMenuItems(), product]);
  productForm.reset();
  showAuthStatus(document.querySelector("#admin-status"), "Product added to the menu.", "success");
  refreshCategoryFilter();
  renderProducts();
  renderActivity();
});

productList.addEventListener("click", (event) => {
  const button = event.target.closest(".edit-product, .toggle-product, .delete-product");
  const productId = button?.dataset.productId;
  if (!productId) return;
  let products = getMenuItems();

  if (button.classList.contains("delete-product")) {
    products = products.filter((product) => product.id !== productId);
  }

  if (button.classList.contains("toggle-product")) {
    products = products.map((product) => product.id === productId ? { ...product, isAvailable: !product.isAvailable } : product);
  }

  if (button.classList.contains("edit-product")) {
    const product = products.find((item) => item.id === productId);
    editProductForm.elements.id.value = product.id;
    editProductForm.elements.name.value = product.name;
    editProductForm.elements.category.value = product.category;
    editProductForm.elements.description.value = product.description;
    editProductForm.elements.price.value = product.price;
    editProductModal.show();
    return;
  }

  saveMenuItems(products);
  refreshCategoryFilter();
  renderProducts();
});

editProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const changes = Object.fromEntries(new FormData(editProductForm).entries());
  const products = getMenuItems().map((product) => product.id === changes.id ? { ...product, name: changes.name, category: changes.category, description: changes.description, price: Number(changes.price) } : product);
  saveMenuItems(products);
  editProductModal.hide();
  refreshCategoryFilter();
  renderProducts();
});

productSearch.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
refreshCategoryFilter();
renderProducts();
renderActivity();
