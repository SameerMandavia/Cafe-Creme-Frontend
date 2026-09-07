const navigation = `
  <nav class="navbar navbar-dark navbar-expand-lg cafe-creme-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="home.html"><span class="brand-mark" aria-hidden="true">CC</span><span>Cafe-Creme</span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="nav-location"><span aria-hidden="true">&#x2316;</span><div><small>Delivering to</small><strong>Choose location</strong></div></div>
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item"><a class="nav-link" href="menu.html">Menu</a></li><li class="nav-item"><a class="nav-link" href="offers.html">Offers</a></li><li class="nav-item"><a class="nav-link" href="reservations.html">Reservations</a></li><li class="nav-item nav-cta-item"><a class="nav-link nav-cta" href="menu.html">Order online</a></li><li class="nav-item"><a class="nav-link" href="orders.html">Orders</a></li><li class="nav-item" id="cart-nav"><a class="nav-link cart-link" href="cart.html" aria-label="View cart">&#x1F6D2; <span class="cart-label">Cart</span> <span class="badge rounded-pill" id="cart-count">0</span></a></li><li class="nav-item" id="account-nav"></li>
        </ul>
      </div>
    </div>
  </nav>`;
const footer = `<footer class="container py-4 site-footer-content"><div><a class="footer-brand" href="home.html">Cafe-Creme</a><p>Good coffee, familiar faces, and room to pause.</p></div><div class="footer-links"><a href="about.html">About</a><a href="contact.html">Contact</a><a href="menu.html">Menu</a><a href="offers.html">Offers</a><a href="reservations.html">Reservations</a></div><small>&copy; 2026 Cafe-Creme</small></footer>`;
document.querySelector("#site-header").innerHTML = navigation; document.querySelector("#site-footer").innerHTML = footer;
document.body.insertAdjacentHTML("beforeend", `<nav class="mobile-bottom-nav" aria-label="Mobile navigation"><a href="home.html" data-mobile-page="home"><span aria-hidden="true">&#x2302;</span><small>Home</small></a><a href="menu.html" data-mobile-page="menu"><span aria-hidden="true">&#x2630;</span><small>Browse</small></a><a href="orders.html" data-mobile-page="orders"><span aria-hidden="true">&#x25A3;</span><small>Orders</small></a><a href="cart.html" data-mobile-page="cart"><span aria-hidden="true">&#x1F6D2;</span><small>Cart</small></a></nav>`);
const accountNav = document.querySelector("#account-nav"); const currentUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null"); const savedAddress = JSON.parse(localStorage.getItem("cafe-creme-saved-address") || "null"); const navLocationLabel = document.querySelector(".nav-location strong");
if (navLocationLabel && savedAddress?.address) { const compactAddress = /^GPS location/i.test(savedAddress.address) ? "Current location" : savedAddress.address; navLocationLabel.textContent = compactAddress.length > 24 ? `${compactAddress.slice(0, 24)}...` : compactAddress; }
if (currentUser) { accountNav.innerHTML = '<a class="nav-link" href="account.html">Account</a><button class="nav-link nav-button" id="nav-logout" type="button">Logout</button>'; document.querySelector("#nav-logout").addEventListener("click", () => { localStorage.removeItem("cafe-creme-current-user"); window.location.href = "login.html"; }); } else accountNav.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
const currentPage = document.body.dataset.page; document.querySelectorAll(`[href="${currentPage}.html"]`).forEach((link) => link.classList.add("active")); document.querySelector(`[data-mobile-page="${currentPage}"]`)?.classList.add("active");
const updateCartBadge = () => { const badge = document.querySelector("#cart-count"); if (badge) badge.textContent = Object.values(JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}")).reduce((total, quantity) => total + quantity, 0); }; updateCartBadge(); window.addEventListener("storage", updateCartBadge);
const signedInEmail = currentUser?.email;
const orderUpdates = JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]").filter((order) => (!signedInEmail || !order.userEmail || order.userEmail === signedInEmail) && ["Order received", "Preparing", "Out for delivery"].includes(order.status));
const cartNav = document.querySelector("#cart-nav");
if (cartNav) { const updates = document.createElement("li"); updates.className = "nav-item nav-updates"; updates.innerHTML = `<a class="nav-link" href="orders.html" aria-label="View order updates">Updates${orderUpdates.length ? ` <span class="updates-badge">${orderUpdates.length}</span>` : ""}</a>`; cartNav.before(updates); }
document.querySelectorAll("img").forEach((image, index) => { image.decoding = "async"; if (index > 0 && !image.loading) image.loading = "lazy"; });
