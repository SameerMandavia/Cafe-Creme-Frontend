const reservationForm = document.querySelector("#reservation-form");
const reservationStatus = document.querySelector("#reservation-status");
const reservationDate = document.querySelector("#reservation-date");

reservationDate.min = new Date().toISOString().split("T")[0];

reservationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const payload = Object.fromEntries(formData.entries());
  payload.guests = Number(payload.guests);

  try {
    const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("Reservation could not be submitted");
    reservationStatus.textContent = "Your reservation request has been received. We will contact you shortly.";
    reservationStatus.className = "alert alert-success mt-4";
    reservationForm.reset();
    reservationDate.min = new Date().toISOString().split("T")[0];
  } catch {
    reservationStatus.textContent = "We could not submit your request. Please call us at +91 98765 43210.";
    reservationStatus.className = "alert alert-warning mt-4";
  }
});
