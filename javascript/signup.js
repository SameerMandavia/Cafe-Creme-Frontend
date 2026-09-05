const signupForm = document.querySelector("#signup-form");
const signupStatus = document.querySelector("#auth-status");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(signupForm).entries());
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
