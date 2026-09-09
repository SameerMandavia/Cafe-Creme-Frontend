if (!document.querySelector('link[data-fontawesome]')) {
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
  fontAwesome.dataset.fontawesome = "true";
  document.head.appendChild(fontAwesome);
}
const navigation = `
  <nav class="navbar navbar-dark navbar-expand-lg cafe-creme-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="home.html"><span class="brand-mark" aria-hidden="true">CC</span><span>Cafe-Creme</span><small class="admin-header-label">Admin console</small></a>
      <button class="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="nav-location"><span aria-hidden="true"><i class="fa-solid fa-location-dot"></i></span><div><small>Delivering to</small><strong>Choose location</strong></div></div>
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item"><a class="nav-link" href="offers.html"><i class="fa-solid fa-tag" aria-hidden="true"></i> Offers</a></li><li class="nav-item nav-cta-item"><a class="nav-link nav-cta" href="menu.html"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Order online</a></li><li class="nav-item" id="cart-nav"><a class="nav-link cart-link" href="cart.html" aria-label="View cart"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> <span class="cart-label">Cart</span> <span class="badge rounded-pill" id="cart-count">0</span></a></li><li class="nav-item" id="account-nav"></li>
        </ul>
      </div>
    </div>
  </nav>`;
const footer = `<footer class="container py-4 site-footer-content"><div><a class="footer-brand" href="home.html">Cafe-Creme</a><p>Good coffee, familiar faces, and room to pause.</p></div><div class="footer-links"><a href="about.html">About</a><a href="contact.html">Contact</a><a href="menu.html">Menu</a><a href="offers.html">Offers</a><a href="reservations.html">Reservations</a></div><small>&copy; 2026 Cafe-Creme</small></footer>`;
document.querySelector("#site-header").innerHTML = navigation; document.querySelector("#site-footer").innerHTML = footer;
const mainContent = document.querySelector("main"); if (mainContent && !mainContent.id) mainContent.id = "main-content"; document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#main-content">Skip to content</a>');
const navbarToggler = document.querySelector(".navbar-toggler"); const navbarCollapse = document.querySelector("#navbarNav");
if (navbarToggler && navbarCollapse) { navbarToggler.addEventListener("click", () => { const open = navbarCollapse.classList.toggle("show"); navbarToggler.setAttribute("aria-expanded", String(open)); }); }
document.body.insertAdjacentHTML("beforeend", `<nav class="mobile-bottom-nav" aria-label="Mobile navigation"><a href="home.html" data-mobile-page="home"><i class="fa-solid fa-house" aria-hidden="true"></i><small>Home</small></a><a href="menu.html" data-mobile-page="menu"><i class="fa-solid fa-mug-hot" aria-hidden="true"></i><small>Browse</small></a><a href="orders.html" data-mobile-page="orders"><i class="fa-solid fa-receipt" aria-hidden="true"></i><small>Orders</small></a><a href="cart.html" data-mobile-page="cart"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><small>Cart</small></a></nav>`);
const accountNav = document.querySelector("#account-nav"); const currentUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null"); const savedAddress = JSON.parse(localStorage.getItem("cafe-creme-saved-address") || "null"); const navLocationLabel = document.querySelector(".nav-location strong");
if (navLocationLabel && savedAddress?.address) { const compactAddress = /^GPS location/i.test(savedAddress.address) ? "Current location" : savedAddress.address; navLocationLabel.textContent = compactAddress.length > 24 ? `${compactAddress.slice(0, 24)}...` : compactAddress; }
if (currentUser) { accountNav.innerHTML = '<div class="account-menu"><button class="nav-link account-menu-toggle" type="button" aria-expanded="false"><i class="fa-solid fa-user" aria-hidden="true"></i> Account <i class="fa-solid fa-chevron-down account-chevron" aria-hidden="true"></i></button><div class="account-menu-panel"><a href="account.html">Profile</a><a href="orders.html">Order history</a><a href="orders.html">Updates</a><a href="reservations.html">Reservations</a><button id="nav-logout" type="button"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Logout</button></div></div>'; const accountToggle = accountNav.querySelector(".account-menu-toggle"); const accountMenu = accountNav.querySelector(".account-menu"); accountToggle.addEventListener("click", () => { const open = accountMenu.classList.toggle("is-open"); accountToggle.setAttribute("aria-expanded", String(open)); }); document.addEventListener("click", (event) => { if (!accountMenu.contains(event.target)) { accountMenu.classList.remove("is-open"); accountToggle.setAttribute("aria-expanded", "false"); } }); document.querySelector("#nav-logout").addEventListener("click", () => { localStorage.removeItem("cafe-creme-current-user"); window.location.href = "login.html"; }); } else accountNav.innerHTML = '<a class="nav-link" href="login.html"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Sign in</a>';
const currentPage = document.body.dataset.page; document.querySelectorAll(`[href="${currentPage}.html"]`).forEach((link) => { link.classList.add("active"); link.setAttribute("aria-current", "page"); }); document.querySelector(`[data-mobile-page="${currentPage}"]`)?.classList.add("active"); document.querySelector(`[data-mobile-page="${currentPage}"]`)?.setAttribute("aria-current", "page");
const updateCartBadge = () => { const badge = document.querySelector("#cart-count"); if (badge) badge.textContent = Object.values(JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}")).reduce((total, quantity) => total + quantity, 0); }; updateCartBadge(); window.addEventListener("storage", updateCartBadge);
const signedInEmail = currentUser?.email;
const orderUpdates = signedInEmail ? JSON.parse(localStorage.getItem("cafe-creme-orders") || "[]").filter((order) => (!order.userEmail || order.userEmail === signedInEmail) && ["Order received", "Preparing", "Out for delivery"].includes(order.status)) : [];
const customerNotifications = signedInEmail ? JSON.parse(localStorage.getItem("cafe-creme-notifications") || "[]").filter((item) => item.userEmail === signedInEmail) : [];
const cartNav = document.querySelector("#cart-nav");
if (cartNav && currentUser) { const updateCount = orderUpdates.length + customerNotifications.filter((item) => !item.read).length; const accountToggle = document.querySelector(".account-menu-toggle"); if (accountToggle && updateCount) accountToggle.insertAdjacentHTML("beforeend", ` <span class="updates-badge">${updateCount}</span>`); }
const unreadCustomerNotification = customerNotifications.find((item) => !item.read);
if (unreadCustomerNotification && document.body.dataset.page !== "admin") { const toast = document.createElement("aside"); toast.className = "customer-notification-toast"; toast.setAttribute("role", "status"); toast.innerHTML = `<i class="fa-solid ${unreadCustomerNotification.type === "reservation" ? "fa-calendar-check" : "fa-bell"}" aria-hidden="true"></i><div><strong>${unreadCustomerNotification.title}</strong><p>${unreadCustomerNotification.message}</p><a href="orders.html">View Updates</a></div><button type="button" aria-label="Dismiss notification">×</button>`; document.body.appendChild(toast); toast.querySelector("button").addEventListener("click", () => { const notifications = JSON.parse(localStorage.getItem("cafe-creme-notifications") || "[]").map((item) => item.id === unreadCustomerNotification.id ? { ...item, read: true } : item); localStorage.setItem("cafe-creme-notifications", JSON.stringify(notifications)); toast.remove(); }); }
document.querySelectorAll("img").forEach((image, index) => { image.decoding = "async"; if (index > 0 && !image.loading) image.loading = "lazy"; });
const iconReplacements = [
  [".orders-search-wrap span[aria-hidden]", "fa-solid fa-magnifying-glass"],
  [".empty-orders-icon", "fa-solid fa-mug-hot"],
  [".hero-floating-icon", "fa-solid fa-circle-check"],
  [".confirmation-icon", "fa-solid fa-circle-check"]
];
iconReplacements.forEach(([selector, iconClass]) => {
  document.querySelectorAll(selector).forEach((element) => { element.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>`; });
});
const layoutAdminActionIcons = { "#refresh-admin": "fa-solid fa-arrows-rotate", "#export-admin": "fa-solid fa-file-code", "#export-csv": "fa-solid fa-file-csv" };
Object.entries(layoutAdminActionIcons).forEach(([selector, iconClass]) => {
  const button = document.querySelector(selector);
  if (button && !button.querySelector("i")) button.insertAdjacentHTML("afterbegin", `<i class="${iconClass}" aria-hidden="true"></i> `);
});
