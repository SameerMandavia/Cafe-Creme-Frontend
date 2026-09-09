const loginForm = document.querySelector("#login-form");
const authStatus = document.querySelector("#auth-status");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const credentials = Object.fromEntries(new FormData(loginForm).entries());
  if (window.CafeCremeApi) {
    try {
      const apiUser = await window.CafeCremeApi.login(credentials);
      const user = { ...apiUser, role: apiUser.role === "ADMIN" ? "admin" : "user" };
      setCurrentUser(user);
      window.location.href = user.role === "admin" ? "admin.html" : "home.html";
      return;
    } catch (error) {
      showAuthStatus(authStatus, "Unable to sign in to the cafe service. Check your details or try again.");
      return;
    }
  }
  const user = getUsers().find((candidate) => candidate.email === credentials.email && candidate.password === credentials.password);

  if (!user) {
    showAuthStatus(authStatus, "Email or password is incorrect.");
    return;
  }

  setCurrentUser(user);
  window.location.href = user.role === "admin" ? "admin.html" : "home.html";
});
