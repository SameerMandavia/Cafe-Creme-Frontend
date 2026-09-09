const signupForm = document.querySelector("#signup-form");
const signupStatus = document.querySelector("#auth-status");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(signupForm).entries());
  if (window.CafeCremeApi) {
    try {
      await window.CafeCremeApi.register(details);
      const apiUser = await window.CafeCremeApi.login({ email: details.email, password: details.password });
      setCurrentUser({ ...apiUser, role: "user" });
      showAuthStatus(signupStatus, "Account created. Your checkout details are now ready.", "success");
      setTimeout(() => { window.location.href = "home.html"; }, 350);
    } catch (error) {
      showAuthStatus(signupStatus, "We could not create your account. Please check your details and try again.");
    }
    return;
  }
  const users = getUsers();

  if (users.some((user) => user.email === details.email)) {
    showAuthStatus(signupStatus, "An account with this email already exists.");
    return;
  }

  const newUser = { name: details.name, email: details.email, phone: details.phone, password: details.password, role: "user" };
  users.push(newUser);
  localStorage.setItem(authUsersKey, JSON.stringify(users));
  setCurrentUser(newUser);
  showAuthStatus(signupStatus, "Account created. Your checkout details are now ready.", "success");
  signupForm.reset();
});
