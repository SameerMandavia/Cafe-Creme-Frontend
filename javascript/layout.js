const navigation = `
  <nav class="navbar navbar-expand-lg cafe-creme-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="home.html">Cafe-Creme</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="home.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="menu.html">Menu</a></li>
          <li class="nav-item"><a class="nav-link" href="offers.html">Offers</a></li>
          <li class="nav-item"><a class="nav-link" href="reservations.html">Reservations</a></li>
          <li class="nav-item"><a class="nav-link" href="orders.html">Order Online</a></li>
            <li class="nav-item d-none" id="cart-nav"><a class="nav-link" href="cart.html">Cart <span class="badge rounded-pill text-bg-light" id="cart-count">0</span></a></li>
          <li class="nav-item"><a class="nav-link" href="about.html">About Us</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
          <li class="nav-item" id="account-nav"></li>
        </ul>
      </div>
    </div>
  </nav>
`;

const footer = `
  <footer class="container py-4">
    <p class="mb-0">&copy; 2026 Cafe-Creme</p>
  </footer>
`;

document.querySelector("#site-header").innerHTML = navigation;
document.querySelector("#site-footer").innerHTML = footer;

const accountNav = document.querySelector("#account-nav");
const cartNav = document.querySelector("#cart-nav");
const currentUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null");
if (currentUser) {
  cartNav.classList.remove("d-none");
  accountNav.innerHTML = '<button class="nav-link nav-button" id="nav-logout" type="button">Logout</button>';
  document.querySelector("#nav-logout").addEventListener("click", () => {
    localStorage.removeItem("cafe-creme-current-user");
    window.location.href = "login.html";
  });
} else {
  accountNav.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
}

const currentPage = document.body.dataset.page;
const activeLink = document.querySelector(`[href="${currentPage}.html"]`);
if (activeLink) activeLink.classList.add("active");

const cartCount = document.querySelector("#cart-count");
if (cartCount) {
  const cart = JSON.parse(localStorage.getItem("cafe-creme-cart") || "{}");
  cartCount.textContent = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}
