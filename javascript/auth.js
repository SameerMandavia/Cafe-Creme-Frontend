const authUsersKey = "cafe-creme-users";
const currentUserKey = "cafe-creme-current-user";

function getUsers() {
  const savedUsers = JSON.parse(localStorage.getItem(authUsersKey) || "[]");
  if (!savedUsers.some((user) => user.role === "admin")) {
    savedUsers.push({ name: "Cafe Admin", email: "admin@cafecreme.local", password: "admin123", role: "admin" });
    localStorage.setItem(authUsersKey, JSON.stringify(savedUsers));
  }
  return savedUsers;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(currentUserKey) || "null");
}

function setCurrentUser(user) {
  localStorage.setItem(currentUserKey, JSON.stringify({ name: user.name, email: user.email, phone: user.phone || "", role: user.role }));
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
