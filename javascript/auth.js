const authUsersKey = "cafe-creme-users";
const currentUserKey = "cafe-creme-current-user";

function getUsers() {
  const savedUsers = window.cafeStorage?.read(authUsersKey, []) || [];
  if (!savedUsers.some((user) => user.role === "admin")) {
    savedUsers.push({ name: "Cafe Admin", email: "admin@cafecreme.local", password: "admin123", role: "admin" });
    localStorage.setItem(authUsersKey, JSON.stringify(savedUsers));
  }
  return savedUsers;
}

function getCurrentUser() {
  return window.cafeStorage?.read(currentUserKey, null) || null;
}

function setCurrentUser(user) {
  window.cafeStorage?.write(currentUserKey, { name: user.name, email: user.email, phone: user.phone || "", role: user.role });
}

function logout() {
  localStorage.removeItem(currentUserKey);
  window.location.href = "login.html";
}

function requireAdmin() {
  const user = getCurrentUser();
  if (user?.role !== "admin") {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function showAuthStatus(element, message, type = "danger") {
  element.textContent = message;
  element.className = `alert alert-${type} mt-3`;
}

getUsers();

document.querySelectorAll('input[type="password"]').forEach((input) => {
  const wrapper = document.createElement("div");
  wrapper.className = "password-field";
  input.parentElement.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.className = "password-toggle"; toggle.textContent = "Show";
  toggle.setAttribute("aria-label", "Show password");
  toggle.addEventListener("click", () => { const visible = input.type === "text"; input.type = visible ? "password" : "text"; toggle.textContent = visible ? "Show" : "Hide"; toggle.setAttribute("aria-label", `${visible ? "Show" : "Hide"} password`); });
  wrapper.appendChild(toggle);
  if (input.id === "signup-password") {
    const strength = document.createElement("small"); strength.className = "password-strength"; strength.textContent = "Use 8+ characters with a number for a stronger password."; wrapper.after(strength);
    input.addEventListener("input", () => { const good = input.value.length >= 8 && /\d/.test(input.value); strength.textContent = good ? "Strong password" : "Use 8+ characters with a number for a stronger password."; strength.classList.toggle("is-good", good); });
  }
});
