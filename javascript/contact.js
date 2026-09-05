const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(contactForm).entries());

  try {
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("Message could not be submitted");
    contactStatus.textContent = "Thank you. Your message has been sent to the Cafe-Creme team.";
    contactStatus.className = "alert alert-success mt-4";
    contactForm.reset();
  } catch {
    contactStatus.textContent = "We could not send your message right now. Please email hello@cafe-creme.example.";
    contactStatus.className = "alert alert-warning mt-4";
  }
});
