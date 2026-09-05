const loginForm = document.querySelector("#login-form");
const authStatus = document.querySelector("#auth-status");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const credentials = Object.fromEntries(new FormData(loginForm).entries());
  const user = getUsers().find((candidate) => candidate.email === credentials.email && candidate.password === credentials.password);

  if (!user) {
    showAuthStatus(authStatus, "Email or password is incorrect.");
    return;
  }

  setCurrentUser(user);
  window.location.href = user.role === "admin" ? "admin.html" : "home.html";
});
