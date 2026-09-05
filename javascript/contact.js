const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(contactForm).entries());
  const messages = JSON.parse(localStorage.getItem("cafe-creme-messages") || "[]");
  messages.unshift({ id: `MSG-${Date.now().toString().slice(-6)}`, ...details, createdAt: new Date().toISOString() });
  localStorage.setItem("cafe-creme-messages", JSON.stringify(messages));
  contactStatus.textContent = "Your message is saved for the Cafe-Creme team. Thank you for reaching out.";
  contactStatus.className = "alert alert-success mt-4";
  contactForm.reset();
});
