const accountUser = JSON.parse(localStorage.getItem("cafe-creme-current-user") || "null");
if (!accountUser) window.location.href = "login.html";
else {
  const form = document.querySelector("#account-form"); const status = document.querySelector("#account-status"); const address = document.querySelector("#account-address");
  form.name.value = accountUser.name || ""; form.email.value = accountUser.email || ""; form.phone.value = accountUser.phone || "";
  const savedAddress = JSON.parse(localStorage.getItem("cafe-creme-saved-address") || "null"); if (savedAddress?.address) address.textContent = savedAddress.address;
  form.addEventListener("submit", (event) => { event.preventDefault(); const details = Object.fromEntries(new FormData(form)); const users = JSON.parse(localStorage.getItem("cafe-creme-users") || "[]").map((user) => user.email === accountUser.email ? { ...user, name: details.name, phone: details.phone } : user); const updated = { ...accountUser, name: details.name, phone: details.phone }; localStorage.setItem("cafe-creme-users", JSON.stringify(users)); localStorage.setItem("cafe-creme-current-user", JSON.stringify(updated)); status.textContent = "Profile saved."; status.className = "alert alert-success mt-3"; });
}
